// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Дозволяємо доступ ТІЛЬКИ з нашого фронтенду
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Дозволяємо передавати куки та заголовки авторизації
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Видаляє поля, яких немає в DTO (щоб не пхали сміття)
      forbidNonWhitelisted: true, // (Опціонально) Видає помилку, якщо є зайві поля
      transform: true, // Автоматично перетворює типи (наприклад, string "10" у number 10)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
