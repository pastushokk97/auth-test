import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/user.repository';
import { UserValidatorService } from './services/user-validator.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UsersRepository, UserService, UserValidatorService],
  exports: [UsersRepository, UserService, UserValidatorService],
})
export class UserModule {}
