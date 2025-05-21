import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/error.constants';
import { TypeOrmErrorCode } from '../enums/typeorm-error-code.enum';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export class DatabaseErrorService {
  static handleError(errorCode: string): ErrorResponse {
    const defaultResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.DATABASE_OPERATION_FAILED,
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    };

    const errorHandlers = {
      [TypeOrmErrorCode.UNIQUE_VIOLATION]: () => ({
        statusCode: HttpStatus.CONFLICT,
        message: ERROR_MESSAGES.UNIQUE_VIOLATION,
        error: 'Conflict',
      }),
      [TypeOrmErrorCode.FOREIGN_KEY_VIOLATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.FOREIGN_KEY_VIOLATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.NOT_NULL_VIOLATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.NOT_NULL_VIOLATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.INVALID_TEXT_REPRESENTATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.INVALID_TEXT_REPRESENTATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.STRING_DATA_RIGHT_TRUNCATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.STRING_DATA_RIGHT_TRUNCATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.DEADLOCK_DETECTED]: () => ({
        statusCode: HttpStatus.CONFLICT,
        message: ERROR_MESSAGES.DEADLOCK_DETECTED,
        error: 'Conflict',
      }),
      [TypeOrmErrorCode.CHECK_VIOLATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.CHECK_VIOLATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.EXCLUSION_VIOLATION]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ERROR_MESSAGES.EXCLUSION_VIOLATION,
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.NUMERIC_VALUE_OUT_OF_RANGE]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Numeric value out of range.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.NULL_VALUE_NOT_ALLOWED]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Null value not allowed.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.DATETIME_FIELD_OVERFLOW]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Datetime field overflow.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.DIVISION_BY_ZERO]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Division by zero.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.ERROR_IN_ASSIGNMENT]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error in assignment.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.ESCAPE_STRING_ERROR]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Escape string error.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.INVALID_TIME_ZONE_DISPLACEMENT]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid time zone displacement.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.INVALID_USE_OF_ESCAPE_CHARACTER]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid use of escape character.',
        error: 'Bad Request',
      }),
      [TypeOrmErrorCode.INVALID_PARAMETER_VALUE]: () => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid parameter value.',
        error: 'Bad Request',
      }),
    };

    return errorHandlers[errorCode]?.() || defaultResponse;
  }
}
