import { Injectable } from '@nestjs/common';
import { CommentNotFoundError } from './comment.errors';
import { ReactionsRepository } from './reactions.repository';

const PAGE_SIZE = 50;

@Injectable()
export class ReactionsService {
  constructor(private readonly reactions: ReactionsRepository) {}

  list(postId: string, page: number) {
    return this.reactions.findComments(
      postId,
      (page - 1) * PAGE_SIZE,
      PAGE_SIZE,
    );
  }

  create(postId: string, authorId: string, text: string) {
    return this.reactions.add(postId, authorId, text);
  }

  async delete(postId: string, id: string) {
    if (!(await this.reactions.remove(postId, id)))
      throw new CommentNotFoundError();
  }

  like(postId: string, userId: string) {
    return this.reactions.like({ postId, userId });
  }

  unlike(postId: string, userId: string) {
    return this.reactions.unlike({ postId, userId });
  }
}
