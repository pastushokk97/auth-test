import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisClient } from '../redis/redis-client.service';

import { IdentityEntity } from './entities/identity.entity';
import { UserEntity } from './entities/user.entity';
import { IdentitiesRepository } from './repositories/identity.repository';
import { UsersRepository } from './repositories/user.repository';
import { UserValidatorService } from './services/user-validator.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdentityEntity])],
  controllers: [UserController],
  providers: [
    UsersRepository,
    IdentitiesRepository,
    UserService,
    UserValidatorService,
    RedisClient,
  ],
  exports: [
    UsersRepository,
    IdentitiesRepository,
    UserService,
    UserValidatorService,
    RedisClient,
  ],
})
export class UserModule {}
