import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),  // whitelist: true will remove any additional properties that are not defined in the DTO
  );                                                                      // forbidNonWhitelisted: true will throw an error if there are any additional properties that are not defined in the DTO
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
