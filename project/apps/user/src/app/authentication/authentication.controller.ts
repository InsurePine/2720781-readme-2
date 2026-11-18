import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserExceptionFilter } from '../user/user-exception.filter';
import { UserResponseDto } from '../user/user-response.dto';
import { AccessTokenDto, LoginDto, RegisterDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';

@ApiTags('auth')
@ApiBadRequestResponse({ description: 'Некорректные данные запроса.' })
@UseFilters(UserExceptionFilter)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authentication: AuthenticationService,
    private readonly jwt: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрировать пользователя' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiConflictResponse({ description: 'Email уже зарегистрирован.' })
  async register(@Body() input: RegisterDto) {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    if (
      !firstName ||
      !lastName ||
      Array.from(`${firstName} ${lastName}`).length > 50
    ) {
      throw new BadRequestException(
        'Укажите имя и фамилию общей длиной до 50 символов',
      );
    }

    const user = await this.authentication.register({
      ...input,
      firstName,
      lastName,
    });
    return user.toUser();
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Войти и получить JWT' })
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль.' })
  async login(@Body() input: LoginDto) {
    const user = await this.authentication.login(input);
    return { accessToken: await this.jwt.signAsync({ sub: user.id }) };
  }
}
