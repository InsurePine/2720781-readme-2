import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';

@Injectable()
export class PostRepository {
  private readonly posts = new Map<string, PostEntity>();

  findPublished(offset: number, limit: number) {
    const posts = Array.from(this.posts.values())
      .filter((post) => post.data.status === 'published')
      .sort((first, second) =>
        second.data.publishedAt.localeCompare(first.data.publishedAt),
      );
    return { items: posts.slice(offset, offset + limit), total: posts.length };
  }

  find(id: string) {
    return this.posts.get(id);
  }

  save(post: PostEntity) {
    this.posts.set(post.data.id, post);
    return post;
  }

  remove(id: string) {
    this.posts.delete(id);
  }
}
