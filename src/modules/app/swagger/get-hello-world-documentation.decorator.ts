import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetHelloWorldDocumentation() {
  return applyDecorators(
    ApiOperation({
      description: 'Get Hello World',
      summary: 'Hello World',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Hello world was successfully get',
    }),
  );
}
