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
    const exceptionResponse = exception.getResponse();

    let message = 'Unexpected error';
    let error = HttpStatus[status] || 'Error';
    let errorList = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message || message;
      error = responseObj.error || error;
      errorList = responseObj.errorList || null;
    }

    const errorResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: status,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      [ERROR_RESPONSE_KEYS.MESSAGE]: message,
      [ERROR_RESPONSE_KEYS.ERROR]: error,
      ...(errorList && typeof errorList === 'object' ? { errorList } : {}),
      ...(process.env.NODE_ENV !== 'production' && { debug: exception.stack }),
    };

    response.status(status).json(errorResponse);
  }
}
