import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../user/user-response.dto';
import { AccessTokenDto, LoginDto, RegisterDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';

@ApiTags('auth')
@ApiBadRequestResponse({ description: 'Некорректные данные запроса.' })
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authentication: AuthenticationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрировать пользователя' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiConflictResponse({ description: 'Email уже зарегистрирован.' })
  register(@Body() input: RegisterDto) {
    return this.authentication.register(input);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Войти и получить JWT' })
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль.' })
  login(@Body() input: LoginDto) {
    return this.authentication.login(input);
  }
}
