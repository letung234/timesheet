import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_RESPONSE_KEYS } from '../constants/error.constants';

@Catch()
export class NonHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let debug: string | undefined;

    if (exception instanceof Error) {
      message = exception.message;
      debug =
        process.env.NODE_ENV !== 'production' ? exception.stack : undefined;
    } else {
      message = String(exception);
    }

    const errorResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: status,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      [ERROR_RESPONSE_KEYS.MESSAGE]: message,
      [ERROR_RESPONSE_KEYS.ERROR]: error,
      ...(debug && { debug }),
    };

    response.status(status).json(errorResponse);
  }
}
