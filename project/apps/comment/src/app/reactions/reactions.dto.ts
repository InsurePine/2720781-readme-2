import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsUUID,
  Length,
} from 'class-validator';
import type { Comment } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class CreateCommentDto {
  @ApiProperty({
    minLength: 10,
    maxLength: 300,
    example: 'Спасибо за интересную публикацию!',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(10, 300)
  text!: string;
}

export class CommentResponseDto implements Comment {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  postId!: string;

  @ApiProperty({ description: 'Автор определяется из access token.' })
  authorId!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class CommentPageDto {
  @ApiProperty({ type: [CommentResponseDto] })
  items!: CommentResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;
}

export class LikeCountDto {
  @ApiProperty({ minimum: 0 })
  likesCount!: number;
}

export class StatisticsQueryDto {
  @ApiProperty({
    type: [String],
    description:
      'От 1 до 100 UUID публикаций, через запятую или повторяющийся postIds.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  postIds!: string[];
}

export class StatisticsResponseDto {
  @ApiProperty({ format: 'uuid' })
  postId!: string;

  @ApiProperty({ minimum: 0 })
  likesCount!: number;

  @ApiProperty({ minimum: 0 })
  commentsCount!: number;
}
