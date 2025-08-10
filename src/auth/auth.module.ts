import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getjwtConfig } from 'src/config/jwt.config';
// import { JwtStrategy } from '../user/jstrategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: getjwtConfig,
    inject:[ConfigService],
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
