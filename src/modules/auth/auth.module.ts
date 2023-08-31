import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdentityEntity } from '../user/entities/identity.entity';
import { IdentitiesRepository } from '../user/repositories/identity.repository';

import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([IdentityEntity])],
  providers: [AuthService, IdentitiesRepository],
  exports: [AuthService],
})
export class AuthModule {}
