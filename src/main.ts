import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle("Nest API").setDescription("API documentation").setVersion("1.0.0").addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'jwt-auth',).build();
  const document = SwaggerModule.createDocument(app, config,{
    include:[UserModule, AuthModule]
  });

  SwaggerModule.setup("/docs", app, document);

  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
