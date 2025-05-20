import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_RESPONSE_KEYS } from '../constants/error.constants';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private flattenValidationErrors(
    errors: any[],
    errorList: Record<string, string>,
    parentPath = '',
  ) {
    for (const err of errors) {
      const propertyPath = parentPath
        ? `${parentPath}.${err.property}`
        : err.property;
      if (err.constraints) {
        const firstConstraintKey = Object.keys(err.constraints)[0];
        if (!errorList[propertyPath]) {
          errorList[propertyPath] = err.constraints[firstConstraintKey];
        }
      }
      if (err.children && err.children.length > 0) {
        this.flattenValidationErrors(err.children, errorList, propertyPath);
      }
    }
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorList: Record<string, string> = {};
    let generalErrors: string | null = null;

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      Array.isArray(exceptionResponse['message'])
    ) {
      const messages = exceptionResponse['message'];
      const hasObjectErrors = messages.some(
        (msg) => typeof msg === 'object' && (msg.property || msg.constraints),
      );
      if (hasObjectErrors) {
        this.flattenValidationErrors(messages, errorList);
      }
    } else if (typeof exceptionResponse === 'string') {
      generalErrors = exceptionResponse;
    }

    const errorResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: status,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      [ERROR_RESPONSE_KEYS.MESSAGE]: generalErrors || 'Validation failed',
      [ERROR_RESPONSE_KEYS.ERROR]: 'Bad Request',
      ...(Object.keys(errorList).length > 0 && { errorList }),
    };

    response.status(status).json(errorResponse);
  }
}
