import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

const {
  AUTH_JWT_AUTH_HEADER_REQUIRED,
  AUTH_JWT_UNAUTHORIZED,
  AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
  USER_NOT_FOUND,
} = VALIDATION_ERROR_CONTEXT;

export function SignOutUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Sign out user',
      summary: 'Sign out',
    }),
    ApiBearerAuth('JWT'),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User was successfully signed out',
    }),
    ApiThrowExceptions({
      '403': {
        errors: [
          AUTH_JWT_AUTH_HEADER_REQUIRED,
          AUTH_JWT_UNAUTHORIZED,
          AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
        ],
        description: 'Please, make sure that you have a valid jwt token',
      },
      '404': {
        errors: [USER_NOT_FOUND],
        description: 'User is not found',
      },
    }),
  );
}
