import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1693320915960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        user_id               UUID             NOT NULL     DEFAULT uuid_generate_v4(),
        identity_id           UUID             NOT NULL,
        first_name            VARCHAR(255)     NOT NULL,
        last_name             VARCHAR(255)     NOT NULL,
        email                 VARCHAR(96)      NOT NULL,
        phone                 VARCHAR(15)      NOT NULL,
        password              VARCHAR(255)     NOT NULL,
        is_email_verified     BOOLEAN                       DEFAULT FALSE,
        created_date          TIMESTAMPTZ      NOT NULL     DEFAULT current_timestamp,
        updated_date          TIMESTAMPTZ,
        deleted_date          TIMESTAMPTZ,
        CONSTRAINT pk_users PRIMARY KEY (user_id),
        CONSTRAINT fk_users_identity_id FOREIGN KEY (identity_id) REFERENCES identities(identity_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users";`);
  }
}
