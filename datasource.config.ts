import * as path from 'path';

import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const getDataSourceConfig = ({ logging }): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.join(__dirname, 'src', 'modules', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logger: 'advanced-console',
  logging,
  migrationsTableName: 'migrations',
});

export const connectionDataSource = new DataSource(
  getDataSourceConfig({ logging: true }) as DataSourceOptions,
);
