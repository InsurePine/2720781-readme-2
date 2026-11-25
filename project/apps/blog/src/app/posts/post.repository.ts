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

type PostComparator = (
  firstPost: PostWithStatistics,
  secondPost: PostWithStatistics,
) => number;

@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reactions: ReactionsClient,
  ) {}

  async find(filters: PostFilters) {
    let comparePosts: PostComparator | undefined;

    switch (filters.sort) {
      case undefined:
      case 'date':
        break;
      case 'likes':
        comparePosts = (firstPost, secondPost) =>
          secondPost.likesCount - firstPost.likesCount;
        break;
      case 'comments':
        comparePosts = (firstPost, secondPost) =>
          secondPost.commentsCount - firstPost.commentsCount;
        break;
      default:
        throw new RangeError('Неподдерживаемый вариант сортировки публикаций');
    }

    const where = this.getFilter(filters);
    const offset = (filters.page - 1) * filters.limit;

    const [records, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip: comparePosts ? undefined : offset,
        take: comparePosts ? undefined : filters.limit,
      }),
      comparePosts ? null : this.prisma.post.count({ where }),
    ]);
    const statistics = await this.reactions.getStatistics(
      records.map((post) => post.id),
    );
    const items = this.toViews(records, statistics);

    if (comparePosts) items.sort(comparePosts);

    return {
      items: comparePosts ? items.slice(offset, offset + filters.limit) : items,
      total: total ?? records.length,
    };
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id, deletedAt: null },
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
        where: { id, deletedAt: null },
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
    const result = await this.prisma.post.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count > 0;
  }

  async findDeletedIds(afterId?: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        deletedAt: { not: null },
        id: afterId ? { gt: afterId } : undefined,
      },
      select: { id: true },
      orderBy: { id: 'asc' },
      take: 100,
    });
    return posts.map((post) => post.id);
  }

  private getFilter(filters: PostFilters): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {
      status: filters.status ?? 'published',
      deletedAt: null,
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
