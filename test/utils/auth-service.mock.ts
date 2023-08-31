import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  ForbiddenException,
  NotFoundException,
  VALIDATION_ERROR_CONTEXT,
} from '../../src/exceptions';
import {
  GetUserDataResponse,
  JwtPayload,
} from '../../src/modules/auth/types/auth.types';
import { IdentitiesRepository } from '../../src/modules/user/repositories/identity.repository';
import {
  UserCreateOptions,
  UserLoginOptions,
  UserVerifyOptions,
} from '../../src/modules/user/types/user.type';

@Injectable()
export class AuthServiceMock {
  constructor(
    private readonly jwtService: JwtService,
    private readonly identityRepository: IdentitiesRepository,
  ) {}

  async signUp(options: UserCreateOptions): Promise<{ userSub: string }> {
    const { email } = options;

    return new Promise((resolve, reject) => {
      if (email.includes('valid')) {
        resolve({
          userSub: '744cefaf-48ca-41ed-b728-808193e1e17d',
        });
      }

      reject('Sign up cognito error');
    });
  }

  async authenticateUser(loginRequest: UserLoginOptions): Promise<any> {
    const { email } = loginRequest;

    return new Promise((resolve, reject) => {
      if (email.includes('valid')) {
        resolve({
          getAccessToken: () => {
            return {
              getJwtToken: () => 'JWT_TOKEN_AUTHORIZED',
            };
          },
          getRefreshToken: () => {
            return {
              getToken: () => 'JWT_REFRESH_TOKEN_AUTHORIZED',
            };
          },
        });
      }

      reject('Login cognito error');
    });
  }

  async deleteUser(userSub: string): Promise<{ affected: number }> {
    if (!userSub) return;

    return {
      affected: 1,
    };
  }

  getBearerJwtToken(req: Request): string {
    if (!req.header('Authorization')) {
      throw new ForbiddenException(
        VALIDATION_ERROR_CONTEXT.AUTH_JWT_AUTH_HEADER_REQUIRED,
      );
    }

    return req.header('Authorization').split(' ').pop();
  }

  async authenticate(jwtToken: string): Promise<JwtPayload> {
    const result = this.jwtService.decode(jwtToken) as JwtPayload;

    if (result.username === 'INVALID_JWT') {
      throw new ForbiddenException(
        VALIDATION_ERROR_CONTEXT.AUTH_JWT_UNAUTHORIZED,
      );
    }

    return result;
  }

  async getUserData(options: JwtPayload): Promise<GetUserDataResponse> {
    const user = await this.identityRepository.getOne(options.username);

    if (!user) {
      throw new NotFoundException(VALIDATION_ERROR_CONTEXT.USER_NOT_FOUND);
    }

    return user;
  }

  async verifyUser(options: UserVerifyOptions): Promise<string> {
    const { email, verificationCode } = options;

    return new Promise((resolve, reject) => {
      if (email === 'verified-email-valid@gmail.com') {
        resolve('OK');
      } else if (verificationCode === '654321') {
        reject('Code has expired');
      } else {
        reject('Some error happened');
      }
    });
  }
}
