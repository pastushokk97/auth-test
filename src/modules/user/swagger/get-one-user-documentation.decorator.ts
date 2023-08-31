import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { ApiThrowExceptions } from '../../../decorators/throw-exceptions.decorator';
import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';
import { UserGetOneResponse } from '../types/user.type';

const { USER_IS_NOT_UUID } = VALIDATION_ERROR_CONTEXT;

export const validUserResponse: UserGetOneResponse = {
  userId: '58ebb9bf-a955-429b-97a4-8751a7dbc155',
  firstname: 'Jack',
  lastname: 'Woody',
  email: 'jack-woody@gmail.com',
  phone: '+380677777777',
  createdDate: '2023-08-28T15:33:07.246Z',
  updatedDate: null,
};

export function GetOneUserDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Get a user by userId',
      summary: 'Get a user',
    }),
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
    ApiParam({
      type: 'string',
      format: 'uuid',
      name: 'userId',
    }),
    ApiThrowExceptions({
      '400': {
        errors: [USER_IS_NOT_UUID],
        description:
          'Please, make sure that you follow the contract and pass only valid properties and values',
      },
    }),
  );
}
