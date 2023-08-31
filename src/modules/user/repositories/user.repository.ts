import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository } from 'typeorm';

import { DATABASE_ERROR_CONTEXT, DatabaseException } from '../../../exceptions';
import { UserEntity } from '../entities/user.entity';
import { UserCreateOptionsDB } from '../types/user.type';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createOne(
    opts: UserCreateOptionsDB,
    manager: EntityManager,
  ): Promise<UserEntity> {
    try {
      return await manager.save(UserEntity, opts);
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.USER_INSERT_ONE_ERROR,
      );
    }
  }

  async deleteOne(
    email: string,
    manager: EntityManager,
  ): Promise<DeleteResult> {
    try {
      return await manager.delete(UserEntity, { email });
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.USER_INSERT_ONE_ERROR,
      );
    }
  }
}
