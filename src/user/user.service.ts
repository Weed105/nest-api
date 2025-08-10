import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRequest } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {
    }

    async getAllInfo() {
        const users = await this.prismaService.user.findMany({
            orderBy: { id: "desc" }
        });
        return users;
    }


    async getInfo(id: number, req: Request) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) throw new NotFoundException("Пользователь не найден");
        if ((req.user as User).role === "User" && ((req.user as User).id != user.id)) throw new NotFoundException("Ты можешь смотреть только свою информацию");
        if ((req.user as User).role === "Manager") {
            if (user.role != "User" && (req.user as User).id != user.id) {
                throw new NotFoundException("Ты можешь смотреть информацию о себе и о пользователях");
            }
        }
        return user;
    }

    async putInfo(id: number, req: Request, dto: UserRequest) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) throw new NotFoundException("Пользователь не найден");
        if ((req.user as User).role === "User") {
            if ((req.user as User).id != user.id) throw new NotFoundException("Ты можешь изменять только свою информацию");
        }

        const { name, email, password } = dto;
        const passwordHash = await bcrypt.hash(password, 10);

        if ((req.user as User).role === "Admin") {
            const { role } = dto;
            return this.prismaService.user.update({
                data: {
                    name,
                    email,
                    passwordHash,
                    role
                },
                where: {
                    id
                }
            });
        }
        if ((req.user as User).role === "Manager") {
            if (user.role != "User" && (req.user as User).id != user.id) throw new NotFoundException("Ты можешь изменять информацию только пользователей");
            return this.prismaService.user.update({
                data: {
                    name,
                    email,
                    passwordHash,
                },
                where: {
                    id
                }
            });
        }
        return this.prismaService.user.update({
            data: {
                name,
                email,
                passwordHash,
            },
            where: {
                id
            }
        });
    }

    async deleteUser(id: number, req: Request) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) throw new NotFoundException("Пользователь не найден");
        if ((req.user as User).id === user.id) throw new NotFoundException("Пользователь не найден");
        return this.prismaService.user.delete({
            where: {
                id
            }
        });
    }

    async validate(id: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) throw new NotFoundException("Пользователь не найден");
        return user;
    }

}
