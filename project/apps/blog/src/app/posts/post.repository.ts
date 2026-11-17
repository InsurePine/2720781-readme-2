import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';

@Injectable()
export class PostRepository {
  private readonly posts = new Map<string, PostEntity>();

  list() {
    return Array.from(this.posts.values());
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
