import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CurrentUserInterceptor } from './interceptors/currentUser.interceptor';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  const usersService = app.get(UsersService);
  app.useGlobalInterceptors(
    new CurrentUserInterceptor(usersService, jwtService),
  );
  app.enableCors({
    origin: 'http://localhost:3001', // Allow frontend origin
    credentials: true, // If using cookies or authentication headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
