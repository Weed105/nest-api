import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';



@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TTL: string;
    private readonly JWT_REFRESH_TOKEN_TTL: string;

    private readonly COOKIE_DOMAIN: string;

    constructor(private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,) {
        this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>("JWT_ACCESS_TOKEN_TTL");
        this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>("JWT_REFRESH_TOKEN_TTL");
        this.COOKIE_DOMAIN = configService.getOrThrow<string>("COOKIE_DOMAIN");
    }

    async register(res: Response, dto: RegisterRequest) {
        const { name, email, password } = dto;

        const existUser = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if (existUser) throw new ConflictException("Пользователь с такой почтой существует");
        const user = await this.prismaService.user.create({
            data: {
                name,
                email,
                passwordHash: await bcrypt.hash(password, 10),
            }
        });

        return this.auth(res, user.id, user.role);
    }
    async login(res: Response, dto: LoginRequest) {
        const { email, password } = dto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if (!user) throw new NotFoundException("Пользователь не найден");

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) throw new NotFoundException("Пользователь не найден");

        return this.auth(res, user.id, user.role);
    }

    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            throw new UnauthorizedException("Недействительный refresh-токен");
        }

        const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
        if (payload) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id
                }
            });
            if (!user) throw new NotFoundException("Пользователь не найден");
            return this.auth(res, user.id, user.role);

        }

    }

    async validate(id: number) {
        const user = this.prismaService.user.findUnique({
            where: {
                id
            }
        });

        if (!user) throw new NotFoundException("Пользователь не найден");
        return user;
    }

    private auth(res: Response, id: number, role: string) {
        const { accessToken, refreshToken } = this.generateTokens(id, role);
        this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7));
        return {accessToken};
    }

    private generateTokens(id: number, role:string) {
        
        const payload: JwtPayload = { id, role};

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });


        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private setCookie(res: Response, value: string, expires: Date) {
        res.cookie('refreshToken', value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
        });
    }
}
