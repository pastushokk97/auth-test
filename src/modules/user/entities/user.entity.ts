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

import { USER_ENTITY } from '../../../constants/entities';

import { IdentityEntity } from './identity.entity';

@Entity(USER_ENTITY)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'first_name',
    nullable: true,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'last_name',
    nullable: true,
  })
  lastname: string;

  @Column({
    type: 'varchar',
    length: '96',
    name: 'email',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: '11',
    name: 'phone',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: '255',
    name: 'password',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    name: 'is_email_verified',
    nullable: true,
  })
  isEmailVerified: boolean | null;

  @Column({
    type: 'uuid',
    name: 'identity_id',
    nullable: false,
  })
  identityId: string;

  @CreateDateColumn({
    type: 'timestamptz',
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
    type: 'timestamptz',
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
  updatedDate?: string;

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

  @OneToOne(() => IdentityEntity, (identity) => identity.user)
  @JoinColumn({
    name: 'identity_id',
    referencedColumnName: 'identityId',
  })
  identity: IdentityEntity;
}
