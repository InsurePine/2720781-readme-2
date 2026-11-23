import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import { PrismaService } from '../prisma/prisma.service';
import { PostEntity } from './post.entity';
import type { CreatePost } from './post.types';

type PostWithTags = Prisma.PostGetPayload<{ include: { tags: true } }>;

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(offset: number, limit: number) {
    const where = { status: 'published' as const };
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip: offset,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);
    return { items: posts.map((post) => this.toEntity(post)), total };
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
    return post ? this.toEntity(post) : null;
  }

  async create({ tags = [], ...data }: CreatePost) {
    const post = await this.prisma.post.create({
      data: {
        ...data,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });
    return this.toEntity(post);
  }

  async update(post: PostEntity) {
    const { id, tags, ...data } = post.data;
    try {
      const updated = await this.prisma.post.update({
        where: { id },
        data: {
          ...data,
          tags: {
            set: [],
            connectOrCreate: tags.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        },
        include: { tags: true },
      });
      return this.toEntity(updated);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  async remove(id: string) {
    const result = await this.prisma.post.deleteMany({ where: { id } });
    return result.count > 0;
  }

  private toEntity(post: PostWithTags) {
    const { tags, createdAt, publishedAt, ...fields } = post;
    const data = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== null),
    );
    return new PostEntity({
      ...data,
      createdAt: createdAt.toISOString(),
      publishedAt: publishedAt.toISOString(),
      tags: tags.map((tag) => tag.name),
    } as Post);
  }
}
