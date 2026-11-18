import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsIn,
  IsString,
  IsUrl,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import type {
  PostStatus,
  PostType,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

const types: PostType[] = ['video', 'text', 'quote', 'photo', 'link'];
const statuses: PostStatus[] = ['published', 'draft'];
const urlOptions = { protocols: ['http', 'https'], require_protocol: true };

class PostFieldsDto {
  @ApiProperty({ description: 'Для video и text' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Для video' })
  @IsUrl(urlOptions)
  videoUrl!: string;

  @ApiProperty({ description: 'Для text' })
  @IsString()
  announcement!: string;

  @ApiProperty({ description: 'Для text' })
  @IsString()
  text!: string;

  @ApiProperty({ description: 'Для quote' })
  @IsString()
  quote!: string;

  @ApiProperty({ description: 'Для quote' })
  @IsString()
  quoteAuthor!: string;

  @ApiProperty({ description: 'Для photo' })
  @IsUrl(urlOptions)
  imageUrl!: string;

  @ApiProperty({ description: 'Для link' })
  @IsUrl(urlOptions)
  url!: string;

  @ApiProperty({ description: 'Описание ссылки' })
  @IsString()
  description!: string;

  @ApiProperty({ type: [String], maxItems: 8 })
  @ArrayMaxSize(8)
  @IsString({ each: true })
  tags!: string[];
}

const OptionalPostFields = PartialType(PostFieldsDto, {
  skipNullProperties: false,
});

export class CreatePostDto extends OptionalPostFields {
  @ApiProperty({ enum: types })
  @IsIn(types)
  type!: PostType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId!: string;
}

export class UpdatePostDto extends OptionalPostFields {
  @ApiPropertyOptional({ enum: statuses })
  @ValidateIf(({ status }: UpdatePostDto) => status !== undefined)
  @IsIn(statuses)
  status?: PostStatus;
}

export class PostResponseDto extends CreatePostDto {
  @ApiProperty({ format: 'uuid' })
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
