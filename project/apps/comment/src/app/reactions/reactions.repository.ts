import { Injectable } from '@nestjs/common';
import type { Like } from '@project/shared-types' with { 'resolution-mode': 'import' };
import { CommentEntity } from './comment.entity';

@Injectable()
export class ReactionsRepository {
  private readonly comments = new Map<string, CommentEntity>();
  private readonly likesByPost = new Map<string, Set<string>>();

  list(postId: string) {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.postId === postId,
    );
  }

  find(id: string) {
    return this.comments.get(id);
  }

  add(comment: CommentEntity) {
    this.comments.set(comment.id, comment);
    return comment;
  }

  remove(id: string) {
    this.comments.delete(id);
  }

  like({ postId, userId }: Like) {
    const likes = this.likesByPost.get(postId) ?? new Set<string>();
    likes.add(userId);
    this.likesByPost.set(postId, likes);
    return likes.size;
  }

  unlike({ postId, userId }: Like) {
    const likes = this.likesByPost.get(postId);
    likes?.delete(userId);
    return likes?.size ?? 0;
  }
}
