import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from '../modules/user/entities/user.entity';
import { hashPassword } from '../utils/hash-password';

export class InsertUserTable1683899827093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwords = await Promise.all([
      hashPassword('some-password$123'),
      hashPassword('another-password321$321'),
    ]);
    await queryRunner.manager.getRepository(UserEntity).insert([
      {
        firstname: 'Ihor',
        lastname: 'Apple',
        email: 'test-apple2023@gmail.com',
        password: passwords[0],
        phone: '+380676666666',
      },
      {
        firstname: 'Test',
        lastname: 'Google',
        email: 'test-google2023@gmail.com',
        password: passwords[1],
        phone: '+380677777777',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "users";`);
  }
}
