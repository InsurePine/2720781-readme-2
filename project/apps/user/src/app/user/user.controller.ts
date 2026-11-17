import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly users: UserRepository) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  getUser(@Param('id') id: string) {
    const user = this.users.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user.toUser();
  }
}
