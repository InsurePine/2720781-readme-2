import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsJWT,
  IsUrl,
  Length,
  Validate,
  ValidateIf,
  ValidatorConstraint,
} from 'class-validator';
import type {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import type { TokenPair } from '@project/shared-types' with { 'resolution-mode': 'import' };

@ValidatorConstraint({ name: 'fullNameLength', async: false })
class FullNameLength implements ValidatorConstraintInterface {
  validate(_value: unknown, arguments_: ValidationArguments) {
    const { firstName, lastName } = arguments_.object as RegisterDto;
    if (typeof firstName !== 'string' || typeof lastName !== 'string')
      return false;
    const length = Array.from(`${firstName} ${lastName}`).length;
    return length >= 3 && length <= 50;
  }

  defaultMessage() {
    return 'Имя и фамилия вместе должны содержать от 3 до 50 символов';
  }
}

export class LoginDto {
  @ApiProperty({ example: 'reader@example.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;

  @ApiProperty({
    format: 'password',
    minLength: 6,
    maxLength: 12,
    writeOnly: true,
  })
  @Length(6, 12)
  password!: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'Анна' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 50)
  @Validate(FullNameLength)
  firstName!: string;

  @ApiProperty({ example: 'Соколова' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 50)
  lastName!: string;

  @ApiPropertyOptional({
    format: 'uri',
    description: 'Ссылка на размещённый аватар.',
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  avatarUrl?: string;
}

export class TokenPairDto implements TokenPair {
  @ApiProperty({ description: 'JWT, действующий 15 минут.' })
  accessToken!: string;

  @ApiProperty({ description: 'Refresh token, действующий 7 дней.' })
  refreshToken!: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token из ответа login или refresh.',
    writeOnly: true,
  })
  @IsJWT()
  refreshToken!: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    format: 'password',
    minLength: 6,
    maxLength: 12,
    writeOnly: true,
  })
  @Length(6, 12)
  currentPassword!: string;

  @ApiProperty({
    format: 'password',
    minLength: 6,
    maxLength: 12,
    writeOnly: true,
  })
  @Length(6, 12)
  newPassword!: string;
}
