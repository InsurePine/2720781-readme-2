import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

const MAX_OFFSET = 2_147_483_647;
const MAX_PAGE_SIZE = 50;
const MAX_PAGE = Math.floor(MAX_OFFSET / MAX_PAGE_SIZE) + 1;

export class PageQueryDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    maximum: MAX_PAGE,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE)
  page = 1;
}
