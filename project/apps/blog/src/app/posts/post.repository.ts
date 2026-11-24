import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import { ReactionsClient } from '../clients/reactions.client';
import { PrismaService } from '../prisma/prisma.service';
import { PostEntity } from './post.entity';
import type { NewPost, PostFilters, PostStatistics } from './post.types';

type PostWithTags = Prisma.PostGetPayload<{ include: { tags: true } }>;

export interface PostWithStatistics {
  post: PostEntity;
  likesCount: number;
  commentsCount: number;
}

@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reactions: ReactionsClient,
  ) {}

  async find(filters: PostFilters) {
    if (filters.sort === 'likes' || filters.sort === 'comments') {
      return this.findByReactions(filters);
    }

    const where = this.getFilter(filters);
    const [records, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.post.count({ where }),
    ]);
    const statistics = await this.reactions.getStatistics(
      records.map((post) => post.id),
    );
    return { items: this.toViews(records, statistics), total };
  }

  private async findByReactions(filters: PostFilters) {
    const records = await this.prisma.post.findMany({
      where: this.getFilter(filters),
      include: { tags: true },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    });
    const statistics = await this.reactions.getStatistics(
      records.map((post) => post.id),
    );
    const items = this.toViews(records, statistics);

    if (filters.sort === 'likes') {
      items.sort((left, right) => right.likesCount - left.likesCount);
    } else {
      items.sort((left, right) => right.commentsCount - left.commentsCount);
    }

    const offset = (filters.page - 1) * filters.limit;
    return {
      items: items.slice(offset, offset + filters.limit),
      total: items.length,
    };
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
    return post ? this.toEntity(post) : null;
  }

  async getStatistics(id: string) {
    return this.statisticsFor(id, await this.reactions.getStatistics([id]));
  }

  async create({ tags = [], ...data }: NewPost) {
    try {
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        data.originalPostId
      )
        return null;
      throw error;
    }
  }

  async update(post: PostEntity) {
    const { id, tags, publishedAt, ...data } = post.data;
    try {
      const updated = await this.prisma.post.update({
        where: { id },
        data: {
          ...data,
          publishedAt: new Date(publishedAt),
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
      )
        return null;
      throw error;
    }
  }

  async remove(id: string) {
    const result = await this.prisma.post.deleteMany({ where: { id } });
    return result.count > 0;
  }

  private getFilter(filters: PostFilters): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {
      status: filters.status ?? 'published',
    };
    if (filters.authorId) where.authorId = filters.authorId;
    if (filters.type) where.type = filters.type;
    if (filters.tag) where.tags = { some: { name: filters.tag } };
    if (filters.search) {
      where.OR = filters.search.split(/\s+/).map((word) => ({
        title: {
          contains: word.replace(/[\\%_]/g, '\\$&'),
          mode: 'insensitive',
        },
      }));
    }
    return where;
  }

  private statisticsFor(id: string, statistics: Map<string, PostStatistics>) {
    return {
      likesCount: statistics.get(id)?.likesCount ?? 0,
      commentsCount: statistics.get(id)?.commentsCount ?? 0,
    };
  }

  private toViews(
    records: PostWithTags[],
    statistics: Map<string, PostStatistics>,
  ): PostWithStatistics[] {
    return records.map((record) => ({
      post: this.toEntity(record),
      ...this.statisticsFor(record.id, statistics),
    }));
  }

  private toEntity(post: PostWithTags) {
    return new PostEntity({
      id: post.id,
      type: post.type,
      authorId: post.authorId,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      publishedAt: post.publishedAt.toISOString(),
      isRepost: post.isRepost,
      originalPostId: post.originalPostId ?? undefined,
      originalAuthorId: post.originalAuthorId ?? undefined,
      title: post.title ?? undefined,
      videoUrl: post.videoUrl ?? undefined,
      announcement: post.announcement ?? undefined,
      text: post.text ?? undefined,
      quote: post.quote ?? undefined,
      quoteAuthor: post.quoteAuthor ?? undefined,
      imageUrl: post.imageUrl ?? undefined,
      url: post.url ?? undefined,
      description: post.description ?? undefined,
      tags: post.tags.map((tag) => tag.name),
    } as Post);
  }
}
