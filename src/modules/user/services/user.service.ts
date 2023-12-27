import { Injectable, Logger } from '@nestjs/common';

import {
  ForbiddenException,
  VALIDATION_ERROR_CONTEXT,
} from '../../../exceptions';
import { hashPassword } from '../../../utils/hash-password';
import { AuthService } from '../../auth/services/auth.service';
import { GetUserDataResponse, JwtTokens } from '../../auth/types/auth.types';
import { UsersRepository } from '../repositories/user.repository';
import {
  UserCreateOptions,
  UserGetOneResponse,
  UserLoginOptions,
  UserLoginResponse,
} from '../types/user.type';

import { UserValidatorService } from './user-validator.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userValidatorService: UserValidatorService,
    private readonly authService: AuthService,
  ) {}

  async signUp(options: UserCreateOptions): Promise<void> {
    try {
      await this.userValidatorService.validateUserOnCreate(options);

      const { password, ...user } = options;
      const hash = await hashPassword(password);

      await this.usersRepository.createOne({ ...user, password: hash });
    } catch (error) {
      throw error;
    }
  }

  async login(options: UserLoginOptions): Promise<UserLoginResponse> {
    await this.userValidatorService.validateUserOnLogin(options);

    const user = await this.usersRepository.findOne({
      select: ['userId', 'email', 'firstname', 'lastname'],
      where: {
        email: options.email,
      },
    });

    const { accessToken, refreshToken } = await this.provideJwtTokens({
      userId: user.userId,
      email: user.email,
    });

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<JwtTokens> {
    const decode = await this.authService.authenticate(token);

    const user = await this.usersRepository.findOne({
      where: {
        email: decode.email,
        refreshToken: token,
      },
    });

    if (!user) {
      throw new ForbiddenException(
        VALIDATION_ERROR_CONTEXT.USER_UNKNOWN_OR_INVALID_REFRESH_TOKEN,
      );
    }

    return this.provideJwtTokens({
      userId: user.userId,
      email: user.email,
    });
  }

  async signOut(options: GetUserDataResponse): Promise<void> {
    const { userId, email } = options;

    await this.usersRepository.updateOne(
      {
        userId,
        email,
      },
      {
        accessToken: null,
        refreshToken: null,
      },
    );
  }

  async getMe(options: GetUserDataResponse): Promise<UserGetOneResponse> {
    const { userId, email } = options;
    return this.usersRepository.findOne({
      select: ['userId', 'firstname', 'lastname', 'email', 'phone'],
      where: {
        userId,
        email,
      },
    });
  }

  private async provideJwtTokens(options: {
    userId: string;
    email: string;
  }): Promise<JwtTokens> {
    const { userId, email } = options;
    const { accessToken, refreshToken } = await this.authService.signUserTokens(
      {
        userId,
        email,
      },
    );

    await this.usersRepository.updateOne(
      {
        userId,
      },
      {
        accessToken,
        refreshToken,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
