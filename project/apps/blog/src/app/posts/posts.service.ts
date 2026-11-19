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

  get(id: string) {
    const post = this.find(id);
    if (post.data.status !== 'published') throw new PostNotFoundError();
    return post;
  }

  create(input: CreatePost) {
    return this.posts.save(PostEntity.create(input));
  }

  update(id: string, input: UpdatePost) {
    return this.posts.save(this.find(id).update(input));
  }

  delete(id: string) {
    this.find(id);
    this.posts.remove(id);
  }

  private find(id: string) {
    const post = this.posts.find(id);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
