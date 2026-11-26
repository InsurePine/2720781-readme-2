import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';
import {
  PostAlreadyRepostedError,
  PostForbiddenError,
  PostNotFoundError,
} from './post.errors';
import { PostRepository } from './post.repository';
import type { CreatePost, PostFilters, UpdatePost } from './post.types';

@Injectable()
export class PostsService {
  constructor(private readonly posts: PostRepository) {}

  list(filters: PostFilters) {
    return this.posts.find({ ...filters, status: 'published' });
  }

  drafts(userId: string, filters: PostFilters) {
    return this.posts.find({ ...filters, authorId: userId, status: 'draft' });
  }

  async get(id: string) {
    const post = await this.getPublished(id);
    return { post, ...(await this.posts.getStatistics(id)) };
  }

  async getPublished(id: string) {
    const post = await this.findById(id);
    if (post.data.status !== 'published') throw new PostNotFoundError();
    return post;
  }

  async create(input: CreatePost) {
    const post = await this.posts.create(PostEntity.prepare(input));
    if (!post) throw new PostAlreadyRepostedError();
    return post;
  }

  async update(id: string, userId: string, input: UpdatePost) {
    const post = await this.getOwnedPost(id, userId);
    post.update(input);
    const updated = await this.posts.update(post);
    if (!updated) throw new PostNotFoundError();
    return updated;
  }

  async delete(id: string, userId: string) {
    await this.getOwnedPost(id, userId);
    if (!(await this.posts.remove(id))) throw new PostNotFoundError();
  }

  getDeletedPostIds(afterId?: string) {
    return this.posts.findDeletedIds(afterId);
  }

  async repost(id: string, userId: string) {
    const post = await this.getPublished(id);
    if (post.data.authorId === userId || post.data.originalAuthorId === userId)
      throw new PostForbiddenError();
    const repost = await this.posts.create(
      PostEntity.prepareRepost(post.data, userId),
    );
    if (!repost) throw new PostAlreadyRepostedError();
    return repost;
  }

  private async getOwnedPost(id: string, userId: string) {
    const post = await this.findById(id);
    if (post.data.authorId !== userId) throw new PostForbiddenError();
    return post;
  }

  private async findById(id: string) {
    const post = await this.posts.findById(id);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
