import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from './decorators/authorization.decorator';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRequest } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @UseGuards(AuthGuard('jwt'))
  // @Get("me")
  // async getInfo(@Req() req: Request) {
  //   return await this.userService.getInfo(req);
  // }

  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: "Список всех пользователей",
    description: "Получение списка всех пользователей (доступно только для администраторов)"
  })
  @Authorization()
  @Roles("Admin")
  @Get("")
  async getAllInfo() {
    return await this.userService.getAllInfo();
  }

  @ApiBearerAuth('jwt-auth')

  @ApiOperation({
    summary: "Получение информации",
    description: "Получение информации о пользователе по ID "
  })
  @Authorization()
  @Get(":id")
  async getInfo(@Param("id") id: string, @Req() req: Request) {
    return await this.userService.getInfo(+id, req);
  }

  @ApiBearerAuth('jwt-auth')

  @ApiOperation({
    summary: "Обновление информации",
    description: "Обновление данных пользователя"
  })
  @Authorization()
  @Put(":id")
  async putUserInfo(@Param("id") id: string, @Req() req: Request, @Body() dto: UserRequest) {
    return await this.userService.putInfo(+id, req, dto);
  }
  @ApiBearerAuth('jwt-auth')

  @ApiOperation({
    summary: "Удаление пользователя",
    description: "Удаление пользователя (доступно для администраторов)"
  })
  @Authorization()
  
  @Roles("Admin")
  @Delete(":id")
  async deleteUser(@Param("id") id: string, @Req() req: Request) {
    return await this.userService.deleteUser(+id, req);
  }

}
