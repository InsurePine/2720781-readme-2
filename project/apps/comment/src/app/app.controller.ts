import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Проверить доступность сервиса' })
  @ApiOkResponse({ schema: { example: { message: 'Hello API' } } })
  getData() {
    return this.appService.getData();
  }
}
