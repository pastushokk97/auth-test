import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { UserEntity } from '../user/entities/user.entity';
import { UsersRepository } from '../user/repositories/user.repository';

import { AuthService } from './services/auth.service';

config();

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      secretOrPrivateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, UsersRepository],
  exports: [AuthService],
})
export class AuthModule {}
