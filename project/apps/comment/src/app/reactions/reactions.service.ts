import { Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
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
    return this.reactions.add(new CommentEntity(postId, authorId, text));
  }

  delete(postId: string, id: string) {
    const comment = this.reactions.find(id);
    if (!comment || comment.postId !== postId) throw new CommentNotFoundError();
    this.reactions.remove(id);
  }

  like(postId: string, userId: string) {
    return this.reactions.like({ postId, userId });
  }

  unlike(postId: string, userId: string) {
    return this.reactions.unlike({ postId, userId });
  }
}
