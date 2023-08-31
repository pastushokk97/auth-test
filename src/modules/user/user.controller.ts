import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USER_API } from '../../constants/routes';
import { USER } from '../../constants/tags';
import { RequestWithUser } from '../../constants/user';

import { UserGetOne } from './dto/user-get-one.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserSignUpDTO } from './dto/user-sign-up.dto';
import { UserVerifyDTO } from './dto/user-verify.dto';
import { UserService } from './services/user.service';
import { DeleteUserDocumentation } from './swagger/delete-user-documentation.decorator';
import { GetOneUserDocumentation } from './swagger/get-one-user-documentation.decorator';
import { LoginUserDocumentation } from './swagger/login-user-documentation.decorator';
import { SignUpUserDocumentation } from './swagger/sign-up-user-documentation.decorator';
import { VerifyUserDocumentation } from './swagger/verify-user-documentation.decorator';
import { UserGetOneResponse, UserLoginResponse } from './types/user.type';

@ApiTags(USER)
@Controller(USER_API)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GetOneUserDocumentation()
  @Get('/:userId')
  async getOne(@Param() { userId }: UserGetOne): Promise<UserGetOneResponse> {
    return this.userService.getOne(userId);
  }

  @LoginUserDocumentation()
  @Post('login')
  async login(@Body() body: UserLoginDTO): Promise<UserLoginResponse> {
    return this.userService.login(body);
  }

  @VerifyUserDocumentation()
  @Post('verify')
  async verifyUser(@Body() body: UserVerifyDTO): Promise<void> {
    return this.userService.verifyUser(body);
  }

  @SignUpUserDocumentation()
  @Post('sign-up')
  async signUp(@Body() body: UserSignUpDTO): Promise<void> {
    await this.userService.signUp(body);
  }

  @DeleteUserDocumentation()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@Req() req: RequestWithUser): Promise<void> {
    await this.userService.delete(req.user);
  }
}
