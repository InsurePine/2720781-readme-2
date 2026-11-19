import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

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
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Соколова' })
  @IsString()
  lastName!: string;
}

export class AccessTokenDto {
  @ApiProperty({ description: 'JWT, действующий 15 минут.' })
  accessToken!: string;
}
