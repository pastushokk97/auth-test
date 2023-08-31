import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableIdentities1683819916025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "identities" (
        identity_id         UUID            NOT NULL     DEFAULT uuid_generate_v4(),
        cognito_user_id     UUID            NOT NULL,
        created_date        TIMESTAMPTZ     NOT NULL     DEFAULT current_timestamp,
        updated_date        TIMESTAMPTZ,
        deleted_date        TIMESTAMPTZ,
        CONSTRAINT pk_identities PRIMARY KEY (identity_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "identities";`);

    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
  }
}
