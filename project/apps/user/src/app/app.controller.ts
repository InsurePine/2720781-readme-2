import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Проверить доступность сервиса' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      required: ['message'],
      properties: { message: { type: 'string', example: 'Hello API' } },
    },
  })
  getData() {
    return this.appService.getData();
  }
}
