import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ERROR_RESPONSE_KEYS } from '../constants/error.constants';
import { DatabaseErrorService } from '../services/database-error.service';

interface ErrorResponseType {
  statusCode: number;
  message: string;
  error: string;
}

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponseType = {
      statusCode: 500,
      message: 'Database operation failed',
      error: 'Internal Server Error',
    };

    if (
      exception.driverError &&
      (exception.driverError as unknown as { code: string }).code
    ) {
      const errorCode = (exception.driverError as unknown as { code: string })
        .code;
      const errorResult = DatabaseErrorService.handleError(errorCode);

      errorResponse = {
        statusCode: errorResult.statusCode,
        message: errorResult.message,
        error: errorResult.error,
      };
    }

    const finalResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: errorResponse.statusCode,
      [ERROR_RESPONSE_KEYS.MESSAGE]: errorResponse.message,
      [ERROR_RESPONSE_KEYS.ERROR]: errorResponse.error,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      ...(process.env.NODE_ENV !== 'production' && {
        debug: exception.message,
      }),
    };

    response.status(errorResponse.statusCode).json(finalResponse);
  }
}
