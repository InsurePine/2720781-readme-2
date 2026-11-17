import { randomUUID } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';
import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import type { CreatePostDto, UpdatePostDto } from './post.dto';

export class PostEntity {
  private constructor(public readonly data: Post) {}

  static create(input: CreatePostDto) {
    const now = new Date().toISOString();
    return new PostEntity({
      ...content(input),
      id: randomUUID(),
      authorId: input.authorId,
      createdAt: now,
      publishedAt: now,
      status: 'published',
      isRepost: false,
      tags: normalizeTags(input.tags ?? []),
    });
  }

  update(input: UpdatePostDto) {
    const { status, tags, ...fields } = input;
    return new PostEntity({
      ...this.data,
      ...content({ ...this.data, ...fields }),
      status: status ?? this.data.status,
      tags: tags ? normalizeTags(tags) : this.data.tags,
    } as Post);
  }
}

function normalizeTags(tags: string[]) {
  return [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  ];
}

function required(value: string | undefined, field: string) {
  if (!value?.trim()) throw new BadRequestException(`Заполните поле ${field}`);
  return value;
}

function content(input: CreatePostDto) {
  switch (input.type) {
    case 'video':
      return {
        type: input.type,
        title: required(input.title, 'title'),
        videoUrl: required(input.videoUrl, 'videoUrl'),
      };
    case 'text':
      return {
        type: input.type,
        title: required(input.title, 'title'),
        announcement: required(input.announcement, 'announcement'),
        text: required(input.text, 'text'),
      };
    case 'quote':
      return {
        type: input.type,
        quote: required(input.quote, 'quote'),
        quoteAuthor: required(input.quoteAuthor, 'quoteAuthor'),
      };
    case 'photo':
      return {
        type: input.type,
        imageUrl: required(input.imageUrl, 'imageUrl'),
      };
    case 'link':
      return {
        type: input.type,
        url: required(input.url, 'url'),
        description: input.description,
      };
  }
}
