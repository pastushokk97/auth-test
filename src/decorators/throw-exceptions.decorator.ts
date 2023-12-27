import { applyDecorators, HttpStatus } from '@nestjs/common';

import { ExceptionError } from '../exceptions/types/exception';
import {
  api4xxDecoratorMap,
  mapExceptionErrorsToOpenApiSchema,
} from '../utils/exception-error-mappers';

type UsedExceptionStatusCodes =
  | HttpStatus.BAD_REQUEST
  | HttpStatus.FORBIDDEN
  | HttpStatus.NOT_FOUND
  | HttpStatus.CONFLICT;

type ApiResponseOptions = { description?: string; errors: ExceptionError[] };

type ApiThrowExceptionOptions = Partial<
  Record<UsedExceptionStatusCodes, ApiResponseOptions>
>;

export function ApiThrowExceptions(
  options: ApiThrowExceptionOptions,
): MethodDecorator {
  const apiResponseDecorators: MethodDecorator[] = Object.entries(options).map(
    (throwable) => {
      const [statusCode, { errors, description }] = throwable;
      const { apiResponse, name, defaultDescription } =
        api4xxDecoratorMap[+statusCode];

      return apiResponse({
        description: description || defaultDescription,
        schema: mapExceptionErrorsToOpenApiSchema(+statusCode, name, errors),
      });
    },
  );

  return applyDecorators(...apiResponseDecorators);
}
