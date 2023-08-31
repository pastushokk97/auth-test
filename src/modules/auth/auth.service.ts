import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { Request } from 'express';

import {
  ForbiddenException,
  NotFoundException,
  VALIDATION_ERROR_CONTEXT,
} from '../../exceptions';
import { IdentitiesRepository } from '../user/repositories/identity.repository';
import {
  UserCreateOptions,
  UserLoginOptions,
  UserVerifyOptions,
} from '../user/types/user.type';

import { GetUserDataResponse, JwtPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;

  private readonly providerClient: CognitoIdentityProviderClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly identityRepository: IdentitiesRepository,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_USER_POOL_ID,
      ClientId: process.env.AWS_CLIENT_ID,
    });

    this.providerClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async signUp(options: UserCreateOptions): Promise<ISignUpResult> {
    const { email, password } = options;

    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async verifyUser(options: UserVerifyOptions) {
    const { verificationCode, email } = options;
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async authenticateUser(
    loginRequest: UserLoginOptions,
  ): Promise<CognitoUserSession> {
    const { email, password } = loginRequest;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise<CognitoUserSession>((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
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

    if (!result) {
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

  async deleteUser(userSub: string): Promise<void> {
    if (!userSub) return;

    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      Username: userSub,
      UserPoolId: this.userPool.getUserPoolId(),
    });

    await this.providerClient.send(adminDeleteUserCommand);
  }
}
