import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { PostNotFoundError } from './post.errors';
import { PostRepository } from './post.repository';
import type { CreatePost, UpdatePost } from './post.types';

const PAGE_SIZE = 25;

@Injectable()
export class PostsService {
  constructor(private readonly posts: PostRepository) {}

  list(page: number) {
    return this.posts.findPublished((page - 1) * PAGE_SIZE, PAGE_SIZE);
  }

  async get(id: string) {
    const post = await this.find(id);
    if (post.data.status !== 'published') throw new PostNotFoundError();
    return post;
  }

  create(input: CreatePost) {
    return this.posts.create(PostEntity.prepare(input));
  }

  async update(id: string, input: UpdatePost) {
    const post = await this.find(id);
    const updated = await this.posts.save(post.update(input));
    if (!updated) throw new PostNotFoundError();
    return updated;
  }

  async delete(id: string) {
    if (!(await this.posts.remove(id))) throw new PostNotFoundError();
  }

  private async find(id: string) {
    const post = await this.posts.find(id);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
