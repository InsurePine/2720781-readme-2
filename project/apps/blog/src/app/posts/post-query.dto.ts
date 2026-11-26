import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { PageQueryDto } from '@project/shared-core';
import type { PostType } from '@project/shared-types' with { 'resolution-mode': 'import' };
import type { PostSort } from './post.types';

export class PostQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    maximum: 25,
    default: 25,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(25)
  limit = 25;

  @ApiPropertyOptional({ description: 'ID автора из MongoDB.' })
  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @ApiPropertyOptional({ enum: ['video', 'text', 'quote', 'photo', 'link'] })
  @IsOptional()
  @IsIn(['video', 'text', 'quote', 'photo', 'link'])
  type?: PostType;

  @ApiPropertyOptional({ minLength: 3, maxLength: 10 })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @Length(3, 10)
  @Matches(/^\p{L}\S*$/u)
  tag?: string;

  @ApiPropertyOptional({
    enum: ['date', 'likes', 'comments'],
    default: 'date',
    description: 'Сортировка по убыванию.',
  })
  @IsIn(['date', 'likes', 'comments'])
  sort: PostSort = 'date';
}

export class SearchPostQueryDto extends PageQueryDto {
  @ApiProperty({
    minLength: 1,
    description: 'Слова из заголовка публикации.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1)
  query!: string;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    maximum: 20,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit = 20;
}
