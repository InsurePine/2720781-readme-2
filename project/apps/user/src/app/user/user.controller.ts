import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserExceptionFilter } from './user-exception.filter';
import { UserService } from './user.service';
import { UserResponseDto } from './user-response.dto';

@ApiTags('users')
@UseFilters(UserExceptionFilter)
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  getUser(@Param('id') id: string) {
    return this.users.get(id).toUser();
  }
}
