import * as path from 'path';

import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

export const seedConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.join(__dirname, 'src', 'modules', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'seeds', '*{.ts,.js}')],
  autoLoadEntities: true,
  synchronize: false,
  logger: 'advanced-console',
  logging: true,
  migrationsTableName: 'seeds',
} as PostgresConnectionOptions;

export const connectionDataSource = new DataSource(
  seedConfig as DataSourceOptions,
);
