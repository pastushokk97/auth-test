import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

const {
  AUTH_JWT_AUTH_HEADER_REQUIRED,
  USER_REFRESH_TOKEN_INVALID,
  USER_UNKNOWN_OR_INVALID_REFRESH_TOKEN,
  AUTH_JWT_UNAUTHORIZED,
  AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
} = VALIDATION_ERROR_CONTEXT;

export function RefreshUserTokensDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Refresh tokens',
      summary: `Refresh user's tokens by refresh token`,
    }),
    ApiBearerAuth('JWT'),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Tokens were successfully refreshed',
    }),
    ApiThrowExceptions({
      '400': {
        errors: [USER_REFRESH_TOKEN_INVALID],
        description: 'User is not found',
      },
      '403': {
        errors: [
          AUTH_JWT_AUTH_HEADER_REQUIRED,
          AUTH_JWT_UNAUTHORIZED,
          AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
          USER_UNKNOWN_OR_INVALID_REFRESH_TOKEN,
        ],
        description: 'Please, make sure that you have a valid jwt token',
      },
    }),
  );
}
