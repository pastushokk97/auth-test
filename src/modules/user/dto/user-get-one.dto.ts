import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { VALIDATION_ERROR_CONTEXT } from '../../../exceptions';

export class UserGetOne {
  @ApiProperty({})
  @IsUUID(4, { context: VALIDATION_ERROR_CONTEXT.USER_IS_NOT_UUID })
  userId: string;
}
