import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.log('Authentication JWT');

      const jwtToken = this.authService.getBearerJwtToken(req);
      const identityUser = await this.authService.authenticate(jwtToken);

      req['user'] = await this.authService.getUserData(identityUser);

      next();
    } catch (error) {
      this.logger.error(error.message);

      throw error;
    }
  }
}
