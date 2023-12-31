import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';
import { UserGetOneResponse } from '../types/user.type';

const {
  AUTH_JWT_AUTH_HEADER_REQUIRED,
  AUTH_JWT_UNAUTHORIZED,
  AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
  USER_NOT_FOUND,
} = VALIDATION_ERROR_CONTEXT;

export const validUserResponse: UserGetOneResponse = {
  userId: '58ebb9bf-a955-429b-97a4-8751a7dbc155',
  firstname: 'Jack',
  lastname: 'Woody',
  email: 'jack-woody@gmail.com',
  phone: '+380677777777',
};

export function GetOneUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Get a user by jwt token',
      summary: 'Get myself',
    }),
    ApiBearerAuth('JWT'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User was successfully got',
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
