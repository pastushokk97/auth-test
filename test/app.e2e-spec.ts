import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppController } from '../src/modules/app/app.controller';
import { AppService } from '../src/modules/app/app.service';
import { CommonModule } from '../src/modules/common/common.module';

import { mockLogger } from './utils/logger.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule.forTest()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(mockLogger);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const { status, text } = await request(app.getHttpServer()).get('/');

    expect(status).toStrictEqual(200);
    expect(text).toStrictEqual('Hello World!');
  });
});
