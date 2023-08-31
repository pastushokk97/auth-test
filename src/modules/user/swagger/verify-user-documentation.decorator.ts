import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';
import { UserVerifyDTO } from '../dto/user-verify.dto';

const { USER_EMAIL, USER_VERIFICATION_CODE, USER_EXPIRED_CODE } =
  VALIDATION_ERROR_CONTEXT;

export const validUserBody: UserVerifyDTO = {
  email: 'some-email@gmail.com',
  verificationCode: '123456',
};

export function VerifyUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Verify user',
      summary: 'User verification',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User was successfully verified',
    }),
    ApiThrowExceptions({
      '400': {
        errors: [USER_EMAIL, USER_VERIFICATION_CODE],
        description:
          'Please, make sure that you follow the contract and pass only valid properties and values',
      },
      '409': {
        errors: [USER_EXPIRED_CODE],
        description:
          'Please, make sure that user with such email exists and code are valid',
      },
    }),
    ApiBody({
      type: UserVerifyDTO,
      examples: {
        validExample: {
          summary: 'Valid body example for verify user',
          value: validUserBody,
        },
      },
    }),
  );
}
