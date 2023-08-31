import { Injectable } from '@nestjs/common';

import {
  ConflictException,
  NotFoundException,
  VALIDATION_ERROR_CONTEXT,
} from '../../../exceptions';
import { hashPassword } from '../../../utils/hash-password';
import { UsersRepository } from '../repositories/user.repository';
import { UserCreateOptions, UserLoginOptions } from '../types/user.type';

@Injectable()
export class UserValidatorService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateUserOnCreate(options: UserCreateOptions): Promise<boolean> {
    const isRegistered = await this.usersRepository.exist({
      where: {
        email: options.email,
      },
    });

    if (isRegistered) {
      throw new ConflictException(
        VALIDATION_ERROR_CONTEXT.USER_IS_ALREADY_EXISTS,
      );
    }

    return true;
  }

  async validateUserOnLogin(options: UserLoginOptions): Promise<boolean> {
    const { email, password } = options;
    const user = await this.usersRepository.findOne({
      where: {
        email,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException(VALIDATION_ERROR_CONTEXT.USER_NOT_FOUND);
    }

    const hash = await hashPassword(password);

    if (user.password !== hash) {
      throw new NotFoundException(VALIDATION_ERROR_CONTEXT.USER_NOT_FOUND);
    }

    return true;
  }
}
