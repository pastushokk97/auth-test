import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { getDataSourceConfig } from '../../../datasource.config';
import { loggerOptions } from '../../constants/logger.constants';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({})
export class CommonModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        LoggerModule.forRoot(loggerOptions),
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(getDataSourceConfig({ logging: true })),
        AuthModule,
      ],
    };
  }

  static forTest(): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        ConfigModule.forRoot({ envFilePath: '../.env' }),
        TypeOrmModule.forRoot(getDataSourceConfig({ logging: false })),
        AuthModule,
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/user', method: RequestMethod.DELETE });
  }
}
