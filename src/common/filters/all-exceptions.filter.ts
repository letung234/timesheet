import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface BadRequestPayload {
  message: string;
  errorList?: Record<string, string[]>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const _request = ctx.getRequest<Request>();
    const path = _request.url;
    const timestamp = new Date().toISOString();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let payload: {
      statusCode: number;
      message: string;
      errorList?: Record<string, string[]>;
    } = {
      statusCode,
      message: 'Lỗi Server',
    };

    // 1) Validation errors (BadRequestException với custom payload)
    if (exception instanceof BadRequestException) {
      statusCode = exception.getStatus(); // thường là 400
      const resp = exception.getResponse();
      // ép kiểu an toàn
      if (typeof resp === 'object' && resp !== null && 'message' in resp) {
        const br = resp as BadRequestPayload;
        payload = {
          statusCode,
          message: br.message,
          errorList: br.errorList,
        };
      } else {
        // fallback
        payload = {
          statusCode,
          message: exception.message,
        };
      }

      // 2) Các HttpException khác (404, 401,…)
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse();
      let msg: string;

      if (typeof resp === 'string') {
        msg = resp;
      } else if (typeof resp === 'object' && resp !== null) {
        // có thể là { message: string | string[] }
        const mr = resp as { message?: string | string[] };
        if (Array.isArray(mr.message)) {
          msg = mr.message.join('; ');
        } else {
          msg = mr.message ?? exception.message;
        }
      } else {
        msg = exception.message;
      }

      payload = {
        statusCode,
        message: msg,
      };
    }

    response.status(statusCode).json({
      ...payload,
      timestamp,
      path,
    });
  }
}
