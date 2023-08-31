import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

export class UserSignUpDTO {
  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_FIRST_NAME })
  @MinLength(2, { context: VALIDATION_ERROR_CONTEXT.USER_FIRST_NAME })
  @MaxLength(255, { context: VALIDATION_ERROR_CONTEXT.USER_FIRST_NAME })
  firstname: string;

  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_LAST_NAME })
  @MinLength(2, { context: VALIDATION_ERROR_CONTEXT.USER_LAST_NAME })
  @MaxLength(255, { context: VALIDATION_ERROR_CONTEXT.USER_LAST_NAME })
  lastname: string;

  @IsEmail({}, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  @MaxLength(96, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  email: string;

  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_PHONE })
  @MaxLength(15, { context: VALIDATION_ERROR_CONTEXT.USER_PHONE })
  phone: string;

  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_PASSWORD })
  @MaxLength(255, { context: VALIDATION_ERROR_CONTEXT.USER_PASSWORD })
  password: string;
}
