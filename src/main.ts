import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: app.get(ConfigService).get('CORS_ORIGIN'),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = app.get(ConfigService).get('PORT');
  await app.listen(port);
}
bootstrap();
