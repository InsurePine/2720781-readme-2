import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AnonymousOnlyGuard,
  CurrentUserId,
  JwtAuthGuard,
} from '@project/shared-core';
import { UserExceptionFilter } from '../user/user-exception.filter';
import { UserResponseDto } from '../user/user-response.dto';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  TokenPairDto,
} from './authentication.dto';
import { AuthenticationService } from './authentication.service';

@ApiTags('auth')
@ApiBadRequestResponse({ description: 'Некорректные данные запроса.' })
@UseFilters(UserExceptionFilter)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authentication: AuthenticationService) {}

  @Post('register')
  @UseGuards(AnonymousOnlyGuard)
  @ApiOperation({ summary: 'Зарегистрировать пользователя' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiConflictResponse({ description: 'Email уже зарегистрирован.' })
  @ApiForbiddenResponse({
    description: 'Регистрация доступна анонимным клиентам.',
  })
  @ApiUnauthorizedResponse({
    description: 'Переданный заголовок авторизации недействителен.',
  })
  async register(@Body() input: RegisterDto) {
    const user = await this.authentication.register(input);
    return user.toHttpResponse();
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Войти и получить access/refresh токены' })
  @ApiOkResponse({ type: TokenPairDto })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль.' })
  async login(@Body() input: LoginDto) {
    return this.authentication.login(input);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Обновить пару токенов; прежний refresh token становится недействительным',
  })
  @ApiOkResponse({ type: TokenPairDto })
  @ApiUnauthorizedResponse({
    description: 'Refresh token недействителен или истёк.',
  })
  async refresh(@Body() input: RefreshTokenDto) {
    return this.authentication.refresh(input.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отозвать refresh token пользователя' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async logout(@CurrentUserId() userId: string) {
    await this.authentication.logout(userId);
  }

  @Post('change-password')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить пароль и отозвать refresh token' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Неверный текущий пароль или access token.',
  })
  @ApiNotFoundResponse({ description: 'Пользователь не найден.' })
  async changePassword(
    @CurrentUserId() userId: string,
    @Body() input: ChangePasswordDto,
  ) {
    await this.authentication.changePassword(
      userId,
      input.currentPassword,
      input.newPassword,
    );
  }
}
