import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Проверить доступность сервиса' })
  @ApiOkResponse({ schema: { example: { message: 'Hello API' } } })
  getData() {
    return { message: 'Hello API' };
  }
}
