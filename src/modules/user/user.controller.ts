import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USER_API } from '../../constants/routes';
import { USER } from '../../constants/tags';
import { RequestWithUser } from '../../constants/user';
import { RequestAuthHeader } from '../../decorators/request-headers.decorator';
import { JwtTokens } from '../auth/types/auth.types';

import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserSignUpDTO } from './dto/user-sign-up.dto';
import { UserService } from './services/user.service';
import { GetOneUserDocumentation } from './swagger/get-one-user-documentation.decorator';
import { LoginUserDocumentation } from './swagger/login-user-documentation.decorator';
import { RefreshUserTokensDocumentation } from './swagger/refresh-token-documentation.decorator';
import { SignOutUserDocumentation } from './swagger/sign-out-documentation.decorator';
import { SignUpUserDocumentation } from './swagger/sign-up-user-documentation.decorator';
import { UserGetOneResponse, UserLoginResponse } from './types/user.type';

@ApiTags(USER)
@Controller(USER_API)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SignUpUserDocumentation()
  @Post('sign-up')
  async signUp(@Body() body: UserSignUpDTO): Promise<void> {
    await this.userService.signUp(body);
  }

  @LoginUserDocumentation()
  @Post('login')
  async login(@Body() body: UserLoginDTO): Promise<UserLoginResponse> {
    return this.userService.login(body);
  }

  @GetOneUserDocumentation()
  @Get('me')
  async getOne(@Req() req: RequestWithUser): Promise<UserGetOneResponse> {
    return this.userService.getMe(req.user);
  }

  @RefreshUserTokensDocumentation()
  @Post('refresh-token')
  async refreshToken(
    @RequestAuthHeader() { token }: RefreshTokenDto,
  ): Promise<JwtTokens> {
    return this.userService.refreshToken(token);
  }

  @SignOutUserDocumentation()
  @Post('sign-out')
  async signOut(@Req() req: RequestWithUser): Promise<any> {
    return this.userService.signOut(req.user);
  }
}
