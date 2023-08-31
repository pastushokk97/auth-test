import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

const { USER_EXPIRED_CODE } = VALIDATION_ERROR_CONTEXT;

export function DeleteUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Delete user',
      summary: 'Delete user',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'User was successfully deleted',
    }),
    ApiBearerAuth('JWT'),
    ApiThrowExceptions({
      '404': {
        errors: [USER_EXPIRED_CODE],
        description: 'Please, make sure that user exists',
      },
    }),
  );
}
