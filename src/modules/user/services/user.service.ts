import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DataSource } from 'typeorm';

import {
  ConflictException,
  VALIDATION_ERROR_CONTEXT,
} from '../../../exceptions';
import { hashPassword } from '../../../utils/hash-password';
import {
  useCommitTransaction,
  useReleaseTransaction,
  useRollbackTransaction,
  useTransaction,
} from '../../../utils/use-transactions';
import { AuthService } from '../../auth/auth.service';
import { RedisClient } from '../../redis/redis-client.service';
import { IdentitiesRepository } from '../repositories/identity.repository';
import { UsersRepository } from '../repositories/user.repository';
import {
  UserCreateOptions,
  UserDeleteOptions,
  UserGetOneResponse,
  UserLoginOptions,
  UserLoginResponse,
  UserVerifyOptions,
} from '../types/user.type';

import { UserValidatorService } from './user-validator.service';

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserService.name);

  private cache: RedisClientType;

  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly userValidatorService: UserValidatorService,
    private readonly redisClient: RedisClient,
    private readonly authService: AuthService,
    private readonly identitiesRepository: IdentitiesRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    this.cache = await this.redisClient.getClient();
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.closeConnection();
  }

  async signUp(options: UserCreateOptions): Promise<void> {
    let cognitoUserId: string = '';
    const transaction = await useTransaction(this.dataSource);
    try {
      await this.userValidatorService.validateUserOnCreate(options);

      const { password, ...user } = options;
      const hash = await hashPassword(password);

      const cognitoUser = await this.authService.signUp({
        ...options,
        password,
      });

      cognitoUserId = cognitoUser.userSub;

      const identity = await this.identitiesRepository.createOne(
        { cognitoUserId: cognitoUserId },
        transaction.manager,
      );
      await this.usersRepository.createOne(
        { ...user, identityId: identity.identityId, password: hash },
        transaction.manager,
      );

      await useCommitTransaction(transaction);
    } catch (error) {
      await this.authService.deleteUser(cognitoUserId);
      await useRollbackTransaction(transaction);

      throw error;
    } finally {
      await useReleaseTransaction(transaction);
    }
  }

  async login(options: UserLoginOptions): Promise<UserLoginResponse> {
    await this.userValidatorService.validateUserOnLogin(options);

    const cognitoUser = await this.authService.authenticateUser(options);

    const user = await this.usersRepository.findOne({
      select: ['userId', 'email', 'firstname', 'lastname'],
      where: {
        email: options.email,
      },
    });

    const jwtToken = cognitoUser.getAccessToken().getJwtToken();
    const refreshToken = cognitoUser.getRefreshToken().getToken();

    return {
      ...user,
      jwtToken,
      refreshToken,
    };
  }

  async verifyUser(options: UserVerifyOptions) {
    try {
      await this.authService.verifyUser(options);

      await this.usersRepository.update(
        { email: options.email },
        { isEmailVerified: true },
      );
    } catch {
      throw new ConflictException(VALIDATION_ERROR_CONTEXT.USER_EXPIRED_CODE);
    }
  }

  async getOne(userId: string): Promise<UserGetOneResponse> {
    return this.usersRepository.findOne({
      select: [
        'userId',
        'firstname',
        'lastname',
        'email',
        'phone',
        'createdDate',
        'updatedDate',
      ],
      where: {
        userId,
      },
    });
  }

  async delete(options: UserDeleteOptions): Promise<void> {
    const { email, identityId } = options;
    const transaction = await useTransaction(this.dataSource);

    try {
      const identity = await this.identitiesRepository.findOne({
        where: {
          identityId,
        },
      });

      await this.authService.deleteUser(identity.cognitoUserId);
      await this.usersRepository.deleteOne(email, transaction.manager);
      await this.identitiesRepository.deleteOne(
        identityId,
        transaction.manager,
      );

      await useCommitTransaction(transaction);
    } catch (error) {
      await useRollbackTransaction(transaction);

      throw error;
    } finally {
      await useReleaseTransaction(transaction);
    }
  }
}
