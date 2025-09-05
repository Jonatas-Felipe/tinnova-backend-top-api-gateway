import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/infra/http/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3333);
}

bootstrap();
