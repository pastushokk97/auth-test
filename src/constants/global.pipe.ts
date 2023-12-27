import { ValidationPipe } from '@nestjs/common';

import { mapValidationErrors, ValidationException } from '../exceptions';

export const globalValidationPipe = new ValidationPipe({
  enableDebugMessages: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  transform: true,
  stopAtFirstError: true,
  validateCustomDecorators: true,
  exceptionFactory(errors): ValidationException {
    const errs = mapValidationErrors(errors);

    return new ValidationException(errs);
  },
});
