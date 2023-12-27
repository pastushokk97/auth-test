import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  ForbiddenException,
  NotFoundException,
  VALIDATION_ERROR_CONTEXT,
} from '../../../exceptions';
import { UsersRepository } from '../../user/repositories/user.repository';
import {
  GetUserDataResponse,
  JwtPayload,
  JwtTokens,
  SignTokens,
} from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async signUserTokens(payload: SignTokens): Promise<JwtTokens> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
    });

    return {
      accessToken,
      refreshToken,
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

    if (!result) {
      throw new ForbiddenException(
        VALIDATION_ERROR_CONTEXT.AUTH_JWT_UNAUTHORIZED,
      );
    }

    if (Date.now() / 1000 > result.exp) {
      throw new ForbiddenException(
        VALIDATION_ERROR_CONTEXT.AUTH_JWT_TOKEN_HAS_BEEN_EXPIRED,
      );
    }

    return result;
  }

  async getUserData(options: JwtPayload): Promise<GetUserDataResponse> {
    const { userId, email } = options;

    const user = await this.userRepository.findOne({
      select: ['userId', 'email'],
      where: {
        userId,
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(VALIDATION_ERROR_CONTEXT.USER_NOT_FOUND);
    }

    return user;
  }
}
