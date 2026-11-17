import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class UserResponseDto implements User {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ format: 'date-time' })
  registeredAt!: string;
}
