import { ApiPropertyOptional } from '@nestjs/swagger';

export class PostQueryDto {
  @ApiPropertyOptional({ type: 'integer', default: 1 })
  page = 1;
}
