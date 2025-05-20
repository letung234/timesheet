import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_RESPONSE_KEYS } from '../constants/error.constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message =
      typeof exception.getResponse() === 'string'
        ? exception.getResponse()
        : exception.message || 'Unexpected error';
    const error = HttpStatus[status] || 'Error';
    const errorResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: status,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      [ERROR_RESPONSE_KEYS.MESSAGE]: message,
      [ERROR_RESPONSE_KEYS.ERROR]: error,
      ...(process.env.NODE_ENV !== 'production' && { debug: exception.stack }),
    };
    response.status(status).json(errorResponse);
  }
}
