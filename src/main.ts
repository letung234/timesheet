import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StandardResponseInterceptor } from '~/common/interceptors/standard-response.interceptor';
import { AllExceptionsFilter } from '~/common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
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
      exceptionFactory: (validationErrors = []) => {
        const errorList: Record<string, string[]> = {};

        for (const err of validationErrors) {
          errorList[err.property] = err.constraints
            ? Object.values(err.constraints)
            : ['Lỗi không xác định'];
        }

        return new BadRequestException({
          message: ERROR_MESSAGES.BadRequest,
          errorList,
        });
      },
    }),
  );
  // Enable CORS
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
    handler: (req, res, next) => {
      next(
        new HttpException(
          {
            message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    },
  });
  // Security: Rate limiting
  app.use(limiter);
  // Global prefix
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new StandardResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Start the app and log the port number
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}

void bootstrap();
