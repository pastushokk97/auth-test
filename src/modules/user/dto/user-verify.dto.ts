import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

export class UserVerifyDTO {
  @IsEmail({}, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  @MaxLength(96, { context: VALIDATION_ERROR_CONTEXT.USER_EMAIL })
  email: string;

  @IsString({ context: VALIDATION_ERROR_CONTEXT.USER_VERIFICATION_CODE })
  @Length(6, 6, { context: VALIDATION_ERROR_CONTEXT.USER_VERIFICATION_CODE })
  verificationCode: string;
}
