import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { APP } from '../../constants/tags';

import { AppService } from './app.service';
import { GetHelloWorldDocumentation } from './swagger/get-hello-world-documentation.decorator';

@ApiTags(APP)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @GetHelloWorldDocumentation()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
