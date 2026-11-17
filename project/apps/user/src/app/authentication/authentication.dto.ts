import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

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
  @Length(1, 50)
  firstName!: string;

  @ApiProperty({ example: 'Соколова' })
  @Length(1, 50)
  lastName!: string;
}

export class AccessTokenDto {
  @ApiProperty({ description: 'JWT, действующий 15 минут.' })
  accessToken!: string;
}
