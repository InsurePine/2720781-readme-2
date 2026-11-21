import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import type { Comment } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  id!: string;
  @ApiProperty()
  postId!: string;
  @ApiProperty()
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
