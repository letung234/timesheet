import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { StandardResponseInterceptor } from '~/common/interceptors/standard-response.interceptor';
import {
  ValidationExceptionFilter,
  DatabaseExceptionFilter,
  HttpExceptionFilter,
  NonHttpExceptionFilter,
} from '~/common/filters';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ERROR_MESSAGES } from '~/common/constants/error.constants';
import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const url_client = configService.get<number>('app.url_client');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [url_client || '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(helmet());

  const limiter = rateLimit.default({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  });

  app.use(limiter);
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new StandardResponseInterceptor());

  // Apply global exception filters in order of specificity
  app.useGlobalFilters(
    new ValidationExceptionFilter(), // Handle validation errors first
    new DatabaseExceptionFilter(), // Then handle database errors
    new HttpExceptionFilter(), // Then handle HTTP exceptions
    new NonHttpExceptionFilter(), // Finally handle any other errors
  );

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

void bootstrap();
