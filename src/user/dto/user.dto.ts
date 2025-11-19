import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export enum Roles{
    Admin = "Admin",
    User = "User",
    Manager = "Manager",
}

export class UserRequest {


    @ApiProperty({
        description:"Имя пользователя",
        example:"Name",
        type: String,
    })
    @IsString({ message: "Имя должно быть строкой" })
    @Length(2, 40, { message: "Некоректная длина символов в имени" })
    @IsOptional()
    name: string;

    
    @ApiProperty({
        description:"Почта",
        example:"mail@mail.ru",
        type: String
    })
    @IsString({ message: "Почта должна быть строкой" })
    @IsEmail({}, { message: "Не корректный формат почты" })
    @IsOptional()
    email: string;


    @ApiProperty({
        description:"Пароль",
        example:"123456",
        minimum: 6,
        maximum: 128,
        type: String
    })
    @IsString({ message: "Пароль должен быть строкой" })
    @Length(6, 128, { message: "Пароль должен быть от 6 до 128 символов" })
    @IsOptional()
    password: string;

    @IsString({ message: "Роль должна быть строкой" })
    @IsEnum(Roles, { message: "Роль должна быть одной из: Admin, User, Manager" })
    @IsOptional()
    role: Roles;
}