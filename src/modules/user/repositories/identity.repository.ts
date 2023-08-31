import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository } from 'typeorm';

import { DATABASE_ERROR_CONTEXT, DatabaseException } from '../../../exceptions';
import { GetUserDataResponse } from '../../auth/types/auth.types';
import { IdentityEntity } from '../entities/identity.entity';
import { IdentityCreateOptions } from '../types/user.type';

@Injectable()
export class IdentitiesRepository extends Repository<IdentityEntity> {
  private readonly logger = new Logger(IdentitiesRepository.name);

  constructor(
    @InjectRepository(IdentityEntity)
    private readonly repository: Repository<IdentityEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createOne(
    opts: IdentityCreateOptions,
    manager: EntityManager,
  ): Promise<IdentityEntity> {
    try {
      return await manager.save(IdentityEntity, opts);
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.IDENTITY_INSERT_ONE_ERROR,
      );
    }
  }

  async getOne(cognitoUserId: string): Promise<GetUserDataResponse> {
    return this.createQueryBuilder('i')
      .select([
        'i.identityId AS "identityId"',
        'u.userId AS "userId"',
        'u.email AS "email"',
      ])
      .innerJoin('i.user', 'u')
      .where('i.cognitoUserId = :cognitoUserId', { cognitoUserId })
      .getRawOne<GetUserDataResponse>();
  }

  async deleteOne(
    identityId: string,
    manager: EntityManager,
  ): Promise<DeleteResult> {
    try {
      return await manager.delete(IdentityEntity, { identityId });
    } catch (error) {
      throw new DatabaseException(
        error,
        DATABASE_ERROR_CONTEXT.USER_INSERT_ONE_ERROR,
      );
    }
  }
}
