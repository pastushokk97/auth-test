import { IsEmail, IsString, MaxLength } from 'class-validator';

import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

export class UserLoginDTO {
  @IsEmail({}, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  @MaxLength(96, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  email: string;

  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_PASSWORD })
  @MaxLength(255, { context: VALIDATION_ERROR_CONTEXT.USER_PASSWORD })
  password: string;
}
