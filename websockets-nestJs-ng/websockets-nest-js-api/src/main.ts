import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { APP_API_PORT } from './rooms/constants/app.constants';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set up config
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>(APP_API_PORT, 3001);

  // ensure proper shutdown for docker
  app.enableShutdownHooks();

  // Set up validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Messages API')
    .setDescription('The Messages API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // pass the hostname to bind to docker
  await app.listen(port, '0.0.0.0');
}

bootstrap();
