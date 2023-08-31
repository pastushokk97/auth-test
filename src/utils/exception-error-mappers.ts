import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

import { ExceptionError } from '../exceptions/types/exception';

export function mapExceptionErrorsToOpenApiSchema(
  statusCode: number,
  name: string,
  exceptions: ExceptionError[],
): any {
  return {
    properties: {
      name: { type: 'string', default: name },
      statusCode: { type: 'integer', default: statusCode },
      errors: {
        type: 'array',
        items: {
          anyOf: exceptions.map((exc) => ({
            title: String(exc.errorCode),
            description: exc.message,
            example: exc,
          })),
        },
      },
    },
  };
}

type ApiResponseDecorator = (
  options?: ApiResponseOptions,
) => MethodDecorator & ClassDecorator;
type Api4xxDecoratorOptions = {
  apiResponse: ApiResponseDecorator;
  name: string;
  defaultDescription: string;
};

export const api4xxDecoratorMap: Record<number, Api4xxDecoratorOptions> = {
  400: {
    apiResponse: ApiBadRequestResponse,
    name: 'BadRequestException',
    defaultDescription: `BadRequest <p> 
      Some of the request inputs were not valid. 
      Check the response body for error details and see error messages.`,
  },
  404: {
    apiResponse: ApiNotFoundResponse,
    name: 'NotFoundException',
    defaultDescription: `Not Found <p> 
      There is no resource with specified properties.
      Make sure you provided the correct resource identifier(s).`,
  },
  409: {
    apiResponse: ApiConflictResponse,
    name: 'ConflictException',
    defaultDescription: `Conflict <p> 
      The request can't be processed because of some constraints related to the current state of the application.
      Make sure that all the prerequisites for this request are met or that there are no business restrictions 
      that prevent the request from being fulfilled.`,
  },
};
