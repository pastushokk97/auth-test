import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';
import { UserSignUpDTO } from '../dto/user-sign-up.dto';

const {
  USER_FIRST_NAME,
  USER_LAST_NAME,
  USER_EMAIL,
  USER_PHONE,
  USER_PASSWORD,
  USER_IS_ALREADY_EXISTS,
} = VALIDATION_ERROR_CONTEXT;

export const validUserBody: UserSignUpDTO = {
  firstname: 'Ihor',
  lastname: 'Marcos',
  email: 'some-email@gmail.com',
  phone: '+380677777777',
  password: 'some123Password$',
};

export function SignUpUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Sign up user',
      summary: 'Sign up user',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User was successfully signed up',
    }),
    ApiThrowExceptions({
      '400': {
        errors: [
          USER_FIRST_NAME,
          USER_LAST_NAME,
          USER_EMAIL,
          USER_PHONE,
          USER_PASSWORD,
        ],
        description:
          'Please, make sure that you follow the contract and pass only valid properties and values',
      },
      '409': {
        errors: [USER_IS_ALREADY_EXISTS],
        description:
          'Please, make sure that user with such email does not exist',
      },
    }),
    ApiBody({
      type: UserSignUpDTO,
      examples: {
        validExample: {
          summary: 'Valid body example for user',
          value: validUserBody,
        },
      },
    }),
  );
}
