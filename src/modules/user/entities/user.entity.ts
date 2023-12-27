import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { USER_ENTITY } from '../../../constants/entities';

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
    type: 'text',
    name: 'access_token',
    nullable: true,
  })
  accessToken: string | null;

  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string | null;
}
