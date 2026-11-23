import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  PostStatus,
  PostType,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

const types: PostType[] = ['video', 'text', 'quote', 'photo', 'link'];
const statuses: PostStatus[] = ['published', 'draft'];

class PostFieldsDto {
  @ApiPropertyOptional({ description: 'Для video и text' })
  title?: string;

  @ApiPropertyOptional({ description: 'Для video' })
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'Для text' })
  announcement?: string;

  @ApiPropertyOptional({ description: 'Для text' })
  text?: string;

  @ApiPropertyOptional({ description: 'Для quote' })
  quote?: string;

  @ApiPropertyOptional({ description: 'Для quote' })
  quoteAuthor?: string;

  @ApiPropertyOptional({ description: 'Для photo' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Для link' })
  url?: string;

  @ApiPropertyOptional({ description: 'Описание ссылки' })
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];
}

export class CreatePostDto extends PostFieldsDto {
  @ApiProperty({ enum: types })
  type!: PostType;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  authorId!: string;
}

export class UpdatePostDto extends PostFieldsDto {
  @ApiPropertyOptional({ enum: statuses })
  status?: PostStatus;
}

export class PostResponseDto extends CreatePostDto {
  @ApiProperty({
    example: '10000000-0000-4000-8000-000000000001',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ enum: statuses })
  status!: PostStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  publishedAt!: string;

  @ApiProperty({ example: false })
  isRepost!: boolean;
}

export class PostPageDto {
  @ApiProperty({ type: [PostResponseDto] })
  items!: PostResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  total!: number;
}
