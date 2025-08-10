import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces/jwt.payload";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly userService : UserService,
        private readonly configService : ConfigService
    ){  
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
            algorithms: ['HS256'],
        });
    }

   async validate(payload : JwtPayload) {
        return await this.userService.validate(payload.id);
    }

}