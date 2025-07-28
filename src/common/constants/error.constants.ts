export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  DATABASE_OPERATION_FAILED: 'Database operation failed',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later.',
  UNIQUE_VIOLATION: 'Duplicate value violates unique constraint.',
  FOREIGN_KEY_VIOLATION: 'Foreign key constraint violation.',
  NOT_NULL_VIOLATION: 'Null value in a non-nullable field.',
  INVALID_TEXT_REPRESENTATION: 'Invalid input syntax for type.',
  STRING_DATA_RIGHT_TRUNCATION: 'Value too long for column.',
  DEADLOCK_DETECTED: 'Deadlock detected.',
  CHECK_VIOLATION: 'Check constraint violation.',
  EXCLUSION_VIOLATION: 'Exclusion constraint violation.',
};

export const ERROR_RESPONSE_KEYS = {
  STATUS_CODE: 'statusCode',
  TIMESTAMP: 'timestamp',
  PATH: 'path',
  METHOD: 'method',
  MESSAGE: 'message',
  ERROR: 'error',
  ERRORS: 'errors',
};
