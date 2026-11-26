import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { MongoIdValidationPipe } from '@project/shared-core';
import {
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserExceptionFilter } from './user-exception.filter';
import { UserResponseDto } from './user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@UseFilters(UserExceptionFilter)
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  @ApiBadRequestResponse({ description: 'Некорректный MongoDB ID.' })
  async getUser(@Param('id', MongoIdValidationPipe) id: string) {
    const user = await this.users.get(id);
    return user.toHttpResponse();
  }
}
