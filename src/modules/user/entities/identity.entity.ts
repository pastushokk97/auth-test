import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IDENTITY_ENTITY } from '../../../constants/entities';

import { UserEntity } from './user.entity';

@Entity(IDENTITY_ENTITY)
export class IdentityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'identity_id',
  })
  identityId: string;

  @Column({
    type: 'uuid',
    name: 'cognito_user_id',
    nullable: false,
  })
  cognitoUserId: string;

  @CreateDateColumn({
    name: 'created_date',
    nullable: false,
    default: 'current_timestamp',
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return value.toISOString();
      },
    },
  })
  createdDate: string;

  @UpdateDateColumn({
    name: 'updated_date',
    nullable: true,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return value ? value.toISOString() : value;
      },
    },
  })
  updatedAt?: string;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_date',
    nullable: true,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return value ? value.toISOString() : value;
      },
    },
  })
  deletedAt?: string;

  @OneToOne(() => UserEntity, (user) => user.identity)
  @JoinColumn({
    name: 'identity_id',
    referencedColumnName: 'identityId',
  })
  user: UserEntity;
}
