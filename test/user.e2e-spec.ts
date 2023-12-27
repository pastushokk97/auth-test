import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';

import { globalValidationPipe } from '../src/constants/global.pipe';
import {
  FAIL_CASES,
  SUCCESS_CASES,
  VALIDATION_ERROR_CASES,
} from '../src/constants/tests';
import { globalExceptionFilters } from '../src/exceptions';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CommonModule } from '../src/modules/common/common.module';
import { UserLoginDTO } from '../src/modules/user/dto/user-login.dto';
import { UserSignUpDTO } from '../src/modules/user/dto/user-sign-up.dto';
import { UserEntity } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { hashPassword } from '../src/utils/hash-password';

import { mockLogger } from './utils/logger.mock';

function createLongString(length: number): string {
  let str = '';

  for (let i = 0; i < length; i++) {
    str += 'a';
  }

  return str;
}

const JWT_MATCH_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/;

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let server: HttpServer;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule.forTest(), AuthModule, UserModule],
    }).compile();

    app = moduleFixture
      .createNestApplication()
      .useGlobalFilters(...globalExceptionFilters)
      .useGlobalPipes(globalValidationPipe);

    app.useLogger(mockLogger);

    entityManager = app.get(EntityManager);
    jwtService = app.get(JwtService);
    server = app.getHttpServer();

    useContainer(app.select(UserModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await entityManager.delete(UserEntity, {});

    await app.close();
  });

  describe('POST /api/user/sign-up', () => {
    const simpleBody: UserSignUpDTO = {
      firstname: 'Bob',
      lastname: 'Marcos',
      email: 'email-valid@gmail.com',
      phone: '+380677777777',
      password: 'somePassword$',
    };

    describe(VALIDATION_ERROR_CASES, () => {
      it('should return 400 if firstname is not string', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, firstname: 1 });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10002 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if firstname length is less than 2', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, firstname: 'J' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10002 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if firstname length is bigger than 255', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, firstname: createLongString(256) });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10002 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if lastname is not string', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, lastname: 1 });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10003 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if lastname length is less than 2', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, lastname: 'J' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10003 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if lastname length is bigger than 255', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, lastname: createLongString(256) });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10003 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if email is not valid', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, email: 'some-email' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10004 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if email length is bigger than 96', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({
            ...simpleBody,
            email: `${createLongString(97)}@gmail.com`,
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10004 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if phone is not string', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, phone: 1 });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10005 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if phone length is bigger than 15', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({
            ...simpleBody,
            phone: createLongString(16),
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10005 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if password is not string', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, password: 123 });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10006 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if password length is bigger than 255', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({
            ...simpleBody,
            password: createLongString(256),
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10006 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });

    describe(FAIL_CASES, () => {
      beforeEach(async () => {
        await entityManager.save(UserEntity, {
          firstname: 'Jacob',
          lastname: 'Thunder',
          email: 'some-email@gmail.com',
          phone: '+380666666666',
          password: 'somePassword$123',
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'some-email@gmail.com',
        });
      });

      it('should return 409 if user with such email is already exists', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send({ ...simpleBody, email: 'some-email@gmail.com' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.CONFLICT,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10001 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.CONFLICT);
      });
    });

    describe(SUCCESS_CASES, () => {
      afterAll(async () => {
        await entityManager.delete(UserEntity, {
          email: 'email-valid@gmail.com',
        });
      });

      it('should return 201 and create user', async () => {
        const response = await request(server)
          .post('/api/user/sign-up')
          .send(simpleBody);

        const user = await entityManager.findOne(UserEntity, {
          where: { email: 'email-valid@gmail.com' },
        });

        expect(user).not.toBeNull();
        expect(user.userId).not.toBeNull();
        expect(user.firstname).toBe(simpleBody.firstname);
        expect(user.lastname).toBe(simpleBody.lastname);
        expect(user.email).toBe(simpleBody.email);
        expect(user.phone).toBe(simpleBody.phone);
        expect(user.password).not.toBeNull();
        expect(user.password).not.toBe(simpleBody.password);
        expect(user.accessToken).toBeNull();
        expect(user.refreshToken).toBeNull();
        expect(response.body).toStrictEqual({});
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('POST /api/user/login', () => {
    const simpleBody: UserLoginDTO = {
      email: 'registered-email-valid@gmail.com',
      password: 'somePassword$',
    };

    describe(VALIDATION_ERROR_CASES, () => {
      it('should return 400 if email is not valid', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({ ...simpleBody, email: 'some-email' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10004 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if email length is bigger than 96', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({
            ...simpleBody,
            email: `${createLongString(97)}@gmail.com`,
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10004 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if password is not string', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({ ...simpleBody, password: 123 });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10006 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if password length is bigger than 255', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({
            ...simpleBody,
            password: createLongString(256),
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10006 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });

    describe(FAIL_CASES, () => {
      beforeEach(async () => {
        const password = await hashPassword('somePassword$');

        await entityManager.save(UserEntity, {
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'nefimag320@wlmycn.com',
          phone: '+380677777777',
          password,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'nefimag320@wlmycn.com',
        });
      });

      it('should return 404 in case if email does not exists', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({ ...simpleBody, email: 'xakebim322@xgh6.com' });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.NOT_FOUND,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10007 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      });

      it('should return 404 in case if password is not correct', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send({
            ...simpleBody,
            email: 'nefimag320@wlmycn.com',
            password: 'passwordThatNotMatch',
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.NOT_FOUND,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10007 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      });
    });

    describe(SUCCESS_CASES, () => {
      beforeEach(async () => {
        const password = await hashPassword('somePassword$');

        await entityManager.save(UserEntity, {
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'registered-email-valid@gmail.com',
          phone: '+380677777777',
          password,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'registered-email-valid@gmail.com',
        });
      });

      it('should return 201 and login user', async () => {
        const response = await request(server)
          .post('/api/user/login')
          .send(simpleBody);

        expect(response.body.firstname).toStrictEqual('Bob');
        expect(response.body.lastname).toStrictEqual('Marcos');
        expect(response.body.email).toStrictEqual(
          'registered-email-valid@gmail.com',
        );
        expect(response.body.password).toBeUndefined();
        expect(response.body.accessToken).toMatch(JWT_MATCH_REGEX);
        expect(response.body.refreshToken).toMatch(JWT_MATCH_REGEX);
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('POST /api/user/refresh-token', () => {
    describe(VALIDATION_ERROR_CASES, () => {
      it('should return 400 if refresh token is not provided is not string', async () => {
        const response = await request(server).post('/api/user/refresh-token');

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11001 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if refresh token is not jwt', async () => {
        const response = await request(server)
          .post('/api/user/refresh-token')
          .set({
            Authorization: 'INVALID_JWT_TOKEN',
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10008 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });

    describe(FAIL_CASES, () => {
      beforeEach(async () => {
        const password = await hashPassword('somePassword1235$');

        await entityManager.save(UserEntity, {
          userId: '1deb0a0d-ab73-4429-b0af-fce57d65015e',
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'sobopix185@trazeco.com',
          phone: '+380677777777',
          password,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'sobopix185@trazeco.com',
        });
      });

      it('should return 403 if refresh token is not possessed to user', async () => {
        const jwtToken = jwtService.sign({
          userId: 'cf3c0aba-b105-43cf-a949-f9e864c8ee38',
          email: 'some-email@gmail.com',
        });
        const response = await request(server)
          .post('/api/user/refresh-token')
          .set({
            Authorization: jwtToken,
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10009 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 403 if user signed out', async () => {
        const jwtToken = jwtService.sign({
          userId: '1deb0a0d-ab73-4429-b0af-fce57d65015e',
          email: 'sobopix185@trazeco.com',
        });

        const response = await request(server)
          .post('/api/user/refresh-token')
          .set({
            Authorization: jwtToken,
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10009 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe(SUCCESS_CASES, () => {
      let user: UserEntity;
      let jwtToken: string;

      beforeEach(async () => {
        const password = await hashPassword('somePassword123$');

        jwtToken = jwtService.sign({
          userId: '4d35e16c-1a62-42fa-a9f1-fe8078dc4f82',
          email: 'sobopix184@trazeco.com',
        });

        user = await entityManager.save(UserEntity, {
          userId: '4d35e16c-1a62-42fa-a9f1-fe8078dc4f82',
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'sobopix184@trazeco.com',
          phone: '+380677777777',
          password,
          accessToken: 'TOKEN_HAS_BEEN_EXPIRED',
          refreshToken: jwtToken,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'sobopix184@trazeco.com',
        });
      });

      it('should return 201 and create new tokens for the user', async () => {
        const response = await request(server)
          .post('/api/user/refresh-token')
          .set({
            Authorization: jwtToken,
          });

        const updatedUser = await entityManager.findOne(UserEntity, {
          where: {
            email: user.email,
          },
        });

        expect(response.body.accessToken).toMatch(JWT_MATCH_REGEX);
        expect(response.body.refreshToken).toMatch(JWT_MATCH_REGEX);
        expect(response.body.accessToken).toBe(updatedUser.accessToken);
        expect(response.body.refreshToken).toBe(updatedUser.refreshToken);
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('POST api/user/sign-out', () => {
    describe(FAIL_CASES, () => {
      it('should return 403 if auth token is not provided', async () => {
        const response = await request(server).post('/api/user/sign-out');

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11001 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 403 if token is not jwt', async () => {
        const response = await request(server).post('/api/user/sign-out').set({
          Authorization: 'INVALID_TOKEN',
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11002 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 403 if token has been expired', async () => {
        const EXPIRED_TOKEN =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZDlhZjJiMC03ZWIxLTQyZDgtYjAwMS05ZjIxYzYxY2I5MzEiLCJlbWFpbCI6ImVtYWlsLXZhbGlkQGdtYWlsLmNvbSIsImlhdCI6MTcwMzY3NDkzOCwiZXhwIjoxNzAzNjc0OTM5fQ.ooOMpkPbNmdznMLCdRMnfBdgUFRdRJKBxrYmF1VRFeg';
        const response = await request(server).post('/api/user/sign-out').set({
          Authorization: EXPIRED_TOKEN,
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11003 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 404 if user not found', async () => {
        const jwtToken = jwtService.sign({
          userId: '6e1493c2-85c4-4053-82f9-fca17844e43d',
          email: 'email-not-found@gmail.com',
        });
        const response = await request(server).post('/api/user/sign-out').set({
          Authorization: jwtToken,
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.NOT_FOUND,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10007 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      });
    });

    describe(SUCCESS_CASES, () => {
      let user: UserEntity;
      let jwtToken: string;

      beforeEach(async () => {
        const password = await hashPassword('somePassword90$');

        jwtToken = jwtService.sign({
          userId: '6e10cef9-7404-4872-a90b-19e853fd6a18',
          email: 'sobopix181@trazeco.com',
        });

        user = await entityManager.save(UserEntity, {
          userId: '6e10cef9-7404-4872-a90b-19e853fd6a18',
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'sobopix181@trazeco.com',
          phone: '+380677777777',
          password,
          accessToken: jwtToken,
          refreshToken: 'REFRESH_TOKEN',
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'sobopix181@trazeco.com',
        });
      });

      it('should return 201 and sign out user', async () => {
        const response = await request(server).post('/api/user/sign-out').set({
          Authorization: jwtToken,
        });

        const updatedUser = await entityManager.findOne(UserEntity, {
          where: {
            email: user.email,
          },
        });

        expect(response.body).toStrictEqual({});
        expect(updatedUser.accessToken).toBeNull();
        expect(updatedUser.refreshToken).toBeNull();
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('GET api/user/me', () => {
    describe(FAIL_CASES, () => {
      it('should return 403 if auth token is not provided', async () => {
        const response = await request(server).get('/api/user/me');

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11001 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 403 if token is not jwt', async () => {
        const response = await request(server).get('/api/user/me').set({
          Authorization: 'INVALID_TOKEN',
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11002 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 403 if token has been expired', async () => {
        const EXPIRED_TOKEN =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZDlhZjJiMC03ZWIxLTQyZDgtYjAwMS05ZjIxYzYxY2I5MzEiLCJlbWFpbCI6ImVtYWlsLXZhbGlkQGdtYWlsLmNvbSIsImlhdCI6MTcwMzY3NDkzOCwiZXhwIjoxNzAzNjc0OTM5fQ.ooOMpkPbNmdznMLCdRMnfBdgUFRdRJKBxrYmF1VRFeg';
        const response = await request(server).get('/api/user/me').set({
          Authorization: EXPIRED_TOKEN,
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.FORBIDDEN,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 11003 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
      });

      it('should return 404 if user not found', async () => {
        const jwtToken = jwtService.sign({
          userId: '6e1493c2-85c4-4053-82f9-fca17844e43d',
          email: 'email-not-found@gmail.com',
        });
        const response = await request(server).get('/api/user/me').set({
          Authorization: jwtToken,
        });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.NOT_FOUND,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10007 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      });
    });

    describe(SUCCESS_CASES, () => {
      let user: UserEntity;
      let jwtToken: string;

      beforeEach(async () => {
        const password = await hashPassword('somePassword90$');

        jwtToken = jwtService.sign({
          userId: '6e10cef9-7404-4872-a90b-19e853fd6a18',
          email: 'sobopix170@trazeco.com',
        });

        user = await entityManager.save(UserEntity, {
          userId: '6e10cef9-7404-4872-a90b-19e853fd6a18',
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'sobopix170@trazeco.com',
          phone: '+380677777777',
          password,
          accessToken: jwtToken,
          refreshToken: 'REFRESH_TOKEN',
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'sobopix170@trazeco.com',
        });
      });

      it('should return 201 and sign out user', async () => {
        const response = await request(server).get('/api/user/me').set({
          Authorization: jwtToken,
        });

        expect(response.body.email).toStrictEqual(user.email);
        expect(response.body.userId).toStrictEqual(user.userId);
        expect(response.body.phone).toStrictEqual(user.phone);
        expect(response.body.firstname).toStrictEqual(user.firstname);
        expect(response.body.lastname).toStrictEqual(user.lastname);
        expect(response.status).toStrictEqual(HttpStatus.OK);
      });
    });
  });
});
