import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { User } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class UserResponseDto implements User {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiPropertyOptional({ format: 'uri' })
  avatarUrl?: string;

  @ApiProperty({ format: 'date-time' })
  registeredAt!: string;
}
