import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { globalValidationPipe } from './constants/global.pipe';
import { globalExceptionFilters } from './exceptions';
import { AppModule } from './modules/app/app.module';
import { applySwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  applySwagger(app);

  app.enableCors();
  app.use(helmet());

  app.useGlobalFilters(...globalExceptionFilters);
  app.useGlobalPipes(globalValidationPipe);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.APPLICATION_PORT || 9000);
}

bootstrap();
