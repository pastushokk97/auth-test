import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

import { DATABASE_ERROR_CONTEXT, DatabaseException } from '../../../exceptions';
import { UserEntity } from '../entities/user.entity';
import { UserCreateOptions } from '../types/user.type';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createOne(
    opts: UserCreateOptions,
    manager?: EntityManager,
  ): Promise<UserEntity> {
    try {
      if (manager) {
        return await manager.save(UserEntity, opts);
      }
      return await this.save(opts);
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.USER_INSERT_ONE_ERROR,
      );
    }
  }

  async updateOne(
    criteria: FindOptionsWhere<UserEntity>,
    options: Partial<UserEntity>,
    manager?: EntityManager,
  ): Promise<void> {
    try {
      if (manager) {
        await manager.update(UserEntity, criteria, options);
      }
      await this.update({ ...criteria }, options);
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.USER_UPDATE_ONE_ERROR,
      );
    }
  }
}
