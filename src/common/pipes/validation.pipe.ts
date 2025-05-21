import {
  ValidationPipe,
  ValidationPipeOptions,
  BadRequestException,
} from '@nestjs/common';
import { ERROR_RESPONSE_KEYS } from '../constants/error.constants';
import { ValidationService } from '../services/validation.service';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const errorList = ValidationService.flattenErrors(errors);

        return new BadRequestException({
          [ERROR_RESPONSE_KEYS.STATUS_CODE]: 400,
          [ERROR_RESPONSE_KEYS.MESSAGE]: 'Validation failed',
          [ERROR_RESPONSE_KEYS.ERROR]: 'Bad Request',
          ...(Object.keys(errorList).length > 0 && { errorList }),
        });
      },
      ...options,
    });
  }
}
