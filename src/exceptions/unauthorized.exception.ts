import { HttpStatus } from '@nestjs/common';

import { HttpException } from './http.exception';
import { ExceptionError } from './types/exception';

export class UnprocessableEntityException extends HttpException {
  readonly name = UnprocessableEntityException.name;

  constructor({ message, errorCode }: ExceptionError) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, errorCode);
  }
}
