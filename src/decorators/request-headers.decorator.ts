import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { VALIDATION_ERROR_CONTEXT, ValidationException } from '../exceptions';

export const RequestAuthHeader = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    if (!headers['authorization']) {
      throw new ValidationException(
        VALIDATION_ERROR_CONTEXT.AUTH_JWT_AUTH_HEADER_REQUIRED,
      );
    }

    return {
      token: headers['authorization'],
    };
  },
);
