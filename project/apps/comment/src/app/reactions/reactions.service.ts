import { Injectable } from '@nestjs/common';
import { CommentNotFoundError } from './comment.errors';
import { ReactionsRepository } from './reactions.repository';

const PAGE_SIZE = 50;

@Injectable()
export class ReactionsService {
  constructor(private readonly reactions: ReactionsRepository) {}

  listComments(postId: string, page: number) {
    return this.reactions.findComments(
      postId,
      (page - 1) * PAGE_SIZE,
      PAGE_SIZE,
    );
  }

  createComment(postId: string, authorId: string, text: string) {
    return this.reactions.add(postId, authorId, text);
  }

  async deleteComment(postId: string, commentId: string) {
    if (!(await this.reactions.remove(postId, commentId)))
      throw new CommentNotFoundError();
  }

  like(postId: string, userId: string) {
    return this.reactions.like({ postId, userId });
  }

  unlike(postId: string, userId: string) {
    return this.reactions.unlike({ postId, userId });
  }
}
