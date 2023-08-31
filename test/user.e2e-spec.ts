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
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtPayload } from '../src/modules/auth/types/auth.types';
import { CommonModule } from '../src/modules/common/common.module';
import { UserLoginDTO } from '../src/modules/user/dto/user-login.dto';
import { UserSignUpDTO } from '../src/modules/user/dto/user-sign-up.dto';
import { UserVerifyDTO } from '../src/modules/user/dto/user-verify.dto';
import { IdentityEntity } from '../src/modules/user/entities/identity.entity';
import { UserEntity } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { hashPassword } from '../src/utils/hash-password';

import { AuthServiceMock } from './utils/auth-service.mock';
import { mockLogger } from './utils/logger.mock';

function createLongString(length: number): string {
  let str = '';

  for (let i = 0; i < length; i++) {
    str += 'a';
  }

  return str;
}

let decode: jest.Mock<Pick<JwtPayload, 'username'>>;

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let server: HttpServer;

  beforeAll(async () => {
    decode = jest.fn<Pick<JwtPayload, 'username'>, [string]>();

    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule.forTest(), AuthModule, UserModule],
    })
      .overrideProvider(JwtService)
      .useValue({ decode })
      .overrideProvider(AuthService)
      .useClass(AuthServiceMock)
      .compile();

    app = moduleFixture
      .createNestApplication()
      .useGlobalFilters(...globalExceptionFilters)
      .useGlobalPipes(globalValidationPipe);

    app.useLogger(mockLogger);

    entityManager = app.get(EntityManager);
    server = app.getHttpServer();

    useContainer(app.select(UserModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await entityManager.delete(IdentityEntity, {});
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

      it('should return 400 if password is string', async () => {
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
        const identity = await entityManager.save(IdentityEntity, {
          cognitoUserId: '82489396-3f6c-4083-b649-4501ce92785e',
        });
        await entityManager.save(UserEntity, {
          identityId: identity.identityId,
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
        expect(user.createdDate).not.toBeNull();
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

      it('should return 400 if password is string', async () => {
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
        const identity = await entityManager.save(IdentityEntity, {
          cognitoUserId: '82489396-3f6c-4083-b649-4501ce92785e',
        });
        await entityManager.save(UserEntity, {
          identityId: identity.identityId,
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'nefimag320@wlmycn.com',
          phone: '+380677777777',
          password,
          isEmailVerified: true,
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

      it('should return 404 in case if password is not the same', async () => {
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
        const identity = await entityManager.save(IdentityEntity, {
          cognitoUserId: '82489396-3f6c-4083-b649-4501ce92785e',
        });
        await entityManager.save(UserEntity, {
          identityId: identity.identityId,
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'registered-email-valid@gmail.com',
          phone: '+380677777777',
          password,
          isEmailVerified: true,
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
        expect(response.body.jwtToken).toBe('JWT_TOKEN_AUTHORIZED');
        expect(response.body.refreshToken).toBe('JWT_REFRESH_TOKEN_AUTHORIZED');
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('GET /api/user/:userId', () => {
    let user: UserEntity;

    beforeEach(async () => {
      const password = await hashPassword('somePassword$');
      const identity = await entityManager.save(IdentityEntity, {
        cognitoUserId: '82489396-3f6c-4083-b649-4501ce92785e',
      });
      user = await entityManager.save(UserEntity, {
        identityId: identity.identityId,
        firstname: 'Bob',
        lastname: 'Marcos',
        email: 'sobopix183@trazeco.com',
        phone: '+380677777777',
        password,
      });
    });

    afterEach(async () => {
      await entityManager.delete(UserEntity, {
        email: 'sobopix183@trazeco.com',
      });
    });

    describe(VALIDATION_ERROR_CASES, () => {
      it('should return 400 in case of userId is not uuid', async () => {
        const response = await request(server).get('/api/user/not-uuid');

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

    describe(SUCCESS_CASES, () => {
      it('should return 200 and empty body if user is not exists', async () => {
        const response = await request(server).get(
          `/api/user/dcafdddd-2e1e-44fd-b35d-ac2eea5830b3`,
        );

        expect(response.body).toStrictEqual({});
        expect(response.status).toStrictEqual(HttpStatus.OK);
      });

      it('should return 200 and user', async () => {
        const response = await request(server).get(`/api/user/${user.userId}`);

        expect(response.body.userId).toStrictEqual(user.userId);
        expect(response.body.firstname).toStrictEqual(user.firstname);
        expect(response.body.lastname).toStrictEqual(user.lastname);
        expect(response.body.phone).toStrictEqual(user.phone);
        expect(response.body.email).toStrictEqual(user.email);
        expect(response.body.createdDate).toStrictEqual(user.createdDate);
        expect(response.body.updatedDate).toBeNull();
        expect(response.body.password).toBeUndefined();
        expect(response.status).toStrictEqual(HttpStatus.OK);
      });
    });
  });

  describe('POST /api/user/verify', () => {
    const simpleBody: UserVerifyDTO = {
      email: 'verified-email-valid@gmail.com',
      verificationCode: '123456',
    };

    describe(VALIDATION_ERROR_CASES, () => {
      it('should return 400 if email is not valid', async () => {
        const response = await request(server)
          .post('/api/user/verify')
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
          .post('/api/user/verify')
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

      it('should return 400 if verificationCode length is bigger than 6', async () => {
        const response = await request(server)
          .post('/api/user/verify')
          .send({
            ...simpleBody,
            verificationCode: '1234567',
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10010 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if verificationCode length is less than 6', async () => {
        const response = await request(server)
          .post('/api/user/verify')
          .send({
            ...simpleBody,
            verificationCode: '12345',
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10010 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });

      it('should return 400 if verificationCode is not string', async () => {
        const response = await request(server)
          .post('/api/user/verify')
          .send({
            ...simpleBody,
            verificationCode: 12345,
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.BAD_REQUEST,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10010 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      });
    });

    describe(FAIL_CASES, () => {
      it('should return 409 if verificationCode has expired', async () => {
        const response = await request(server)
          .post('/api/user/verify')
          .send({
            ...simpleBody,
            email: 'non-verified-email-valid@gmail.com',
            verificationCode: '654321',
          });

        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: HttpStatus.CONFLICT,
            errors: expect.arrayContaining([
              expect.objectContaining({ errorCode: 10009 }),
            ]),
          }),
        );
        expect(response.status).toStrictEqual(HttpStatus.CONFLICT);
      });
    });

    describe(SUCCESS_CASES, () => {
      beforeEach(async () => {
        const password = await hashPassword('somePassword$');
        const identity = await entityManager.save(IdentityEntity, {
          cognitoUserId: '2aee88db-3f06-4436-a1e6-fda0ccd8dbdb',
        });
        await entityManager.save(UserEntity, {
          identityId: identity.identityId,
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'verified-email-valid@gmail.com',
          phone: '+380677777777',
          password,
          isEmailVerified: true,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'verified-email-valid@gmail.com',
        });
      });

      it('should return 201 and verify user', async () => {
        const response = await request(server)
          .post('/api/user/verify')
          .send(simpleBody);

        const user = await entityManager.findOne(UserEntity, {
          where: {
            email: 'verified-email-valid@gmail.com',
          },
        });

        expect(user.isEmailVerified).toBeTruthy();
        expect(response.status).toStrictEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('DELETE /api/v1/user', () => {
    describe(FAIL_CASES, () => {
      it('should return 403 in case if auth header is not set', async () => {
        const response = await request(server).delete('/api/user');

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

      it('should return 403 in case if auth header is invalid', async () => {
        decode.mockReturnValue({ username: 'INVALID_JWT' });
        const response = await request(server).delete('/api/user').set({
          Authorization: 'Bearer INVALID_JWT',
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

      it('should return 404 in case if user not found', async () => {
        decode.mockReturnValue({
          username: 'd6f98e63-31b3-4314-be1a-ff33dd07ddf7',
        });
        const response = await request(server).delete('/api/user').set({
          Authorization: 'Bearer VALID_JWT',
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
        const identity = await entityManager.save(IdentityEntity, {
          cognitoUserId: '969a2c1a-c09e-4a2e-9c73-482720300bc2',
        });
        await entityManager.save(UserEntity, {
          identityId: identity.identityId,
          firstname: 'Bob',
          lastname: 'Marcos',
          email: 'registered-email-valid@gmail.com',
          phone: '+380677777777',
          password,
          isEmailVerified: true,
        });
      });

      afterEach(async () => {
        await entityManager.delete(UserEntity, {
          email: 'registered-email-valid@gmail.com',
        });
      });

      it('should return 204 and delete user', async () => {
        decode.mockReturnValue({
          username: '969a2c1a-c09e-4a2e-9c73-482720300bc2',
        });
        const response = await request(server).delete('/api/user').set({
          Authorization: 'Bearer VALID_JWT',
        });

        const identity = await entityManager.findOne(IdentityEntity, {
          where: { cognitoUserId: '969a2c1a-c09e-4a2e-9c73-482720300bc2' },
        });
        const user = await entityManager.findOne(UserEntity, {
          where: { email: 'registered-email-valid@gmail.com' },
        });

        expect(response.body).toStrictEqual({});
        expect(identity).toBeNull();
        expect(user).toBeNull();
        expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);
      });
    });
  });
});
