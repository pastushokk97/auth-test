import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppController } from '../src/modules/app/app.controller';
import { AppService } from '../src/modules/app/app.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtPayload } from '../src/modules/auth/types/auth.types';
import { CommonModule } from '../src/modules/common/common.module';

import { AuthServiceMock } from './utils/auth-service.mock';
import { mockLogger } from './utils/logger.mock';

let decode: jest.Mock<Pick<JwtPayload, 'username'>>;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  decode = jest.fn<Pick<JwtPayload, 'username'>, [string]>();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule.forTest()],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(JwtService)
      .useValue({ decode })
      .overrideProvider(AuthService)
      .useClass(AuthServiceMock)
      .compile();

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
