import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(3000);
  const isProduction = process.env.NODE_ENV === 'production';
  const appUrl = isProduction
    ? process.env.RAILWAY_STATIC_URL
    : `http://localhost:${3000}`;
  console.log(`Application is running on: ${appUrl}`);
}
bootstrap();
