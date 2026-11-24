import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import type {
  PostStatus,
  PostType,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

const types: PostType[] = ['video', 'text', 'quote', 'photo', 'link'];
const statuses: PostStatus[] = ['published', 'draft'];

export class CreatePostDto {
  @ApiProperty({ enum: types })
  @IsIn(types)
  type!: PostType;

  @ApiPropertyOptional({
    minLength: 20,
    maxLength: 50,
    description: 'Обязательно для video и text.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'video' || post.type === 'text',
  )
  @Length(20, 50)
  title?: string;

  @ApiPropertyOptional({
    format: 'uri',
    description: 'Обязательная ссылка на видео.',
  })
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'video',
  )
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @Matches(
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/i,
    { message: 'videoUrl должен указывать на видео' },
  )
  videoUrl?: string;

  @ApiPropertyOptional({
    minLength: 50,
    maxLength: 255,
    description: 'Обязательно для text.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'text',
  )
  @Length(50, 255)
  announcement?: string;

  @ApiPropertyOptional({
    minLength: 100,
    maxLength: 1024,
    description: 'Обязательно для text.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'text',
  )
  @Length(100, 1024)
  text?: string;

  @ApiPropertyOptional({
    minLength: 20,
    maxLength: 300,
    description: 'Обязательно для quote.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'quote',
  )
  @Length(20, 300)
  quote?: string;

  @ApiPropertyOptional({
    minLength: 3,
    maxLength: 50,
    description: 'Обязательно для quote.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'quote',
  )
  @Length(3, 50)
  quoteAuthor?: string;

  @ApiPropertyOptional({
    format: 'uri',
    description: 'Обязательная ссылка на размещённое изображение для photo.',
  })
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'photo',
  )
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  imageUrl?: string;

  @ApiPropertyOptional({ format: 'uri', description: 'Обязательно для link.' })
  @ValidateIf(
    (post: CreatePostDto, value: unknown) =>
      value !== undefined || post.type === 'link',
  )
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  url?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @ValidateIf((_post, value) => value !== undefined)
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    maxItems: 8,
    description:
      'Одно слово, 3–10 символов, начинается с буквы. Дубли удаляются.',
  })
  @ValidateIf((_post, value) => value !== undefined)
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return value;
    return value.map((tag: unknown) =>
      typeof tag === 'string' ? tag.trim() : tag,
    );
  })
  @IsArray()
  @ArrayMaxSize(8)
  @Length(3, 10, { each: true })
  @Matches(/^\p{L}\S*$/u, { each: true })
  tags?: string[];
}

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['type'] as const),
  { skipNullProperties: false },
) {
  @ApiPropertyOptional({ enum: statuses })
  @ValidateIf((_post, value) => value !== undefined)
  @IsIn(statuses)
  status?: PostStatus;

  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Дата публикации.',
  })
  @ValidateIf((_post, value) => value !== undefined)
  @IsDateString({ strict: true })
  publishedAt?: string;
}

export class PostResponseDto extends CreatePostDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  authorId!: string;

  @ApiProperty({ enum: statuses })
  status!: PostStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  publishedAt!: string;

  @ApiProperty({ example: false })
  isRepost!: boolean;

  @ApiPropertyOptional({ format: 'uuid' })
  originalPostId?: string;

  @ApiPropertyOptional()
  originalAuthorId?: string;
}

export class PostDetailsDto extends PostResponseDto {
  @ApiProperty({ minimum: 0 })
  likesCount!: number;

  @ApiProperty({ minimum: 0 })
  commentsCount!: number;
}

export class PostPageDto {
  @ApiProperty({ type: [PostDetailsDto] })
  items!: PostDetailsDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;
}
