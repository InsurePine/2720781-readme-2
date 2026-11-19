import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller()
export class AppController {
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
    return { message: 'Hello API' };
  }
}
