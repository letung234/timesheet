import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import {
  ERROR_MESSAGES,
  ERROR_RESPONSE_KEYS,
} from '../constants/error.constants';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.DATABASE_OPERATION_FAILED;
    let error = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (
      exception.driverError &&
      (exception.driverError as unknown as { code: string }).code
    ) {
      switch ((exception.driverError as unknown as { code: string }).code) {
        case '23505': // unique_violation
          statusCode = HttpStatus.CONFLICT;
          message = ERROR_MESSAGES.UNIQUE_VIOLATION;
          error = 'Conflict';
          break;

        case '23503': // foreign_key_violation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.FOREIGN_KEY_VIOLATION;
          error = 'Bad Request';
          break;

        case '23502': // not_null_violation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.NOT_NULL_VIOLATION;
          error = 'Bad Request';
          break;

        case '22P02': // invalid_text_representation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.INVALID_TEXT_REPRESENTATION;
          error = 'Bad Request';
          break;

        case '22001': // string_data_right_truncation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.STRING_DATA_RIGHT_TRUNCATION;
          error = 'Bad Request';
          break;

        case '40P01': // deadlock_detected
          statusCode = HttpStatus.CONFLICT;
          message = ERROR_MESSAGES.DEADLOCK_DETECTED;
          error = 'Conflict';
          break;

        case '23514': // check_violation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.CHECK_VIOLATION;
          error = 'Bad Request';
          break;

        case '23P01': // exclusion_violation
          statusCode = HttpStatus.BAD_REQUEST;
          message = ERROR_MESSAGES.EXCLUSION_VIOLATION;
          error = 'Bad Request';
          break;

        case '22003': // numeric_value_out_of_range
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Numeric value out of range.';
          error = 'Bad Request';
          break;

        case '22004': // null_value_not_allowed
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Null value not allowed.';
          error = 'Bad Request';
          break;

        case '22008': // datetime_field_overflow
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Datetime field overflow.';
          error = 'Bad Request';
          break;

        case '22012': // division_by_zero
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Division by zero.';
          error = 'Bad Request';
          break;

        case '22005': // error_in_assignment
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Error in assignment.';
          error = 'Bad Request';
          break;

        case '2200B': // escape_string_error
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Escape string error.';
          error = 'Bad Request';
          break;

        case '22009': // invalid_time_zone_displacement
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Invalid time zone displacement.';
          error = 'Bad Request';
          break;

        case '2200C': // invalid_use_of_escape_character
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Invalid use of escape character.';
          error = 'Bad Request';
          break;

        case '2200G': // invalid_parameter_value
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Invalid parameter value.';
          error = 'Bad Request';
          break;

        default:
          break;
      }
    }

    const errorResponse = {
      [ERROR_RESPONSE_KEYS.STATUS_CODE]: statusCode,
      [ERROR_RESPONSE_KEYS.TIMESTAMP]: new Date().toISOString(),
      [ERROR_RESPONSE_KEYS.PATH]: request.url,
      [ERROR_RESPONSE_KEYS.METHOD]: request.method,
      [ERROR_RESPONSE_KEYS.MESSAGE]: message,
      [ERROR_RESPONSE_KEYS.ERROR]: error,
      ...(process.env.NODE_ENV !== 'production' && {
        debug: exception.message,
      }),
    };

    response.status(statusCode).json(errorResponse);
  }
}
