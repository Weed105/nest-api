import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  

  @ApiOperation({
    summary:"Регистрация",
    description:"Регистрация в системе нового пользователя"
  })
  @Post("register")
  async register(@Res({passthrough:true}) res : Response, @Body() dto : RegisterRequest){
    return await this.authService.register(res, dto);
  }
  @ApiOperation({
    summary:"Авторизация",
    description:"Авторизация в системе"
  })
  @Post("login")
  async login(@Res({passthrough:true}) res : Response, @Body() dto : LoginRequest){
    return await this.authService.login(res, dto);
  }

  
  @ApiOperation({
    summary:"Обновление токена",
    description:"Получение обновленного токена после авторизации"
  })
  @Post("refresh")
  async refresh(@Req() req: Request, @Res({passthrough:true}) res : Response){
    return await this.authService.refresh(req, res);
  }
}
