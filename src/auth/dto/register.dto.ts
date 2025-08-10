import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterRequest{

    @ApiProperty({
        description:"Имя пользователя",
        example:"Name",
        type: String,
    })
    @IsString({message:"Имя должно быть строкой"})
    @IsNotEmpty({message:"Имя обязательно для заполнения"})
    @Length(2, 40, {message:"Некоректная длина символов в имени"})
    name: string;

    @ApiProperty({
        description:"Почта",
        example:"mail@mail.ru",
        type: String
    })
    @IsString({message:"Почта должна быть строкой"})
    @IsNotEmpty({message:"Почта обязательна для заполнения"})
    @IsEmail({}, {message: "Не корректный формат почты"})
    email: string;

    
    @ApiProperty({
        description:"Пароль",
        example:"123456",
        minimum: 6,
        maximum: 128,
        type: String
    })
    @IsString({message:"Пароль должен быть строкой"})
    @IsNotEmpty({message:"Пароль обязателен для заполнения"})
    @Length(6, 128,{message:"Пароль должен быть от 6 до 128 символов"})
    password: string;
}