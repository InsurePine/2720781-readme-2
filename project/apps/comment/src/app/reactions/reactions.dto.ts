import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';
import type { Comment } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class CreateCommentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  authorId!: string;

  @ApiProperty({
    minLength: 10,
    maxLength: 300,
    example: 'Спасибо за публикацию!',
  })
  @Length(10, 300)
  text!: string;
}

export class CommentResponseDto implements Comment {
  @ApiProperty({ format: 'uuid' })
  id!: string;
  @ApiProperty({ format: 'uuid' })
  postId!: string;
  @ApiProperty({ format: 'uuid' })
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
  total!: number;
}

export class LikeCountDto {
  @ApiProperty({ minimum: 0 })
  likesCount!: number;
}
