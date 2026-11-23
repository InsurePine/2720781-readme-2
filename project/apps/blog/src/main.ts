import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Readme — Blog')
    .setDescription(
      'Данные сервиса хранятся в PostgreSQL. Доступ к БД через Prisma.',
    )
    .setVersion('1.0.0')
    .build();
  SwaggerModule.setup('api/docs', app, () =>
    SwaggerModule.createDocument(app, config),
  );

  const port = Number(app.get(ConfigService).get('PORT') ?? 3001);
  await app.listen(port);
  Logger.log(`Readme Blog: http://localhost:${port}/api/docs`);
}

void bootstrap();
