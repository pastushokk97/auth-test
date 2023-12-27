import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';
import { UserLoginDTO } from '../dto/user-login.dto';
import { UserLoginResponse } from '../types/user.type';

const { USER_EMAIL, USER_PASSWORD, USER_NOT_FOUND } = VALIDATION_ERROR_CONTEXT;

export const validUserBody: UserLoginDTO = {
  email: 'some-email@gmail.com',
  password: 'some123Password$',
};

export const validUserResponse: UserLoginResponse = {
  userId: '87be4c7b-f54e-432b-b666-d4597a603e0c',
  email: 'some-email@gmail.com',
  firstname: 'Jack',
  lastname: 'Woody',
  accessToken: 'JWT_TOKEN',
  refreshToken: 'REFRESH_TOKEN',
};

export function LoginUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Login user',
      summary: 'Login user',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User was successfully login',
      content: {
        'application/json': {
          examples: {
            user: {
              value: validUserResponse,
            },
          },
        },
      },
    }),
    ApiThrowExceptions({
      '400': {
        errors: [USER_EMAIL, USER_PASSWORD],
        description:
          'Please, make sure that you follow the contract and pass only valid properties and values',
      },
      '404': {
        errors: [USER_NOT_FOUND],
        description:
          'Please, make sure that user with such email exists and password is correct',
      },
    }),
    ApiBody({
      type: UserLoginDTO,
      examples: {
        validExample: {
          summary: 'Valid body example for login user',
          value: validUserBody,
        },
      },
    }),
  );
}
