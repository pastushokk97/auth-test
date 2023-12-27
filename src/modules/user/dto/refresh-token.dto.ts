import { IsJWT } from 'class-validator';

import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

export class RefreshTokenDto {
  @IsJWT({
    context: VALIDATION_ERROR_CONTEXT.USER_REFRESH_TOKEN_INVALID,
  })
  token: string;
}
