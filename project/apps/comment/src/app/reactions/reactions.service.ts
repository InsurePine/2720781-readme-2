import { Injectable } from '@nestjs/common';
import { BlogClient } from '../clients/blog.client';
import { CommentForbiddenError, CommentNotFoundError } from './comment.errors';
import { ReactionsRepository } from './reactions.repository';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactions: ReactionsRepository,
    private readonly blog: BlogClient,
  ) {}

  async listComments(postId: string, page: number, limit: number) {
    await this.blog.requirePublished(postId);
    return this.reactions.findComments(postId, page, limit);
  }

  async createComment(postId: string, authorId: string, text: string) {
    await this.blog.requirePublished(postId);
    return this.reactions.add(postId, authorId, text);
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const comment = await this.reactions.findById(postId, commentId);
    if (!comment) throw new CommentNotFoundError();
    if (comment.data.authorId !== userId) throw new CommentForbiddenError();
    if (!(await this.reactions.remove(postId, commentId)))
      throw new CommentNotFoundError();
  }

  async like(postId: string, userId: string) {
    await this.blog.requirePublished(postId);
    return this.reactions.like({ postId, userId });
  }

  async unlike(postId: string, userId: string) {
    await this.blog.requirePublished(postId);
    return this.reactions.unlike({ postId, userId });
  }

  statistics(postIds: string[]) {
    return this.reactions.getStatistics(postIds);
  }

  async removeDeletedPostReactions() {
    let postIds = await this.blog.getDeletedPostIds();
    while (postIds.length > 0) {
      await this.reactions.removeForPosts(postIds);
      postIds = await this.blog.getDeletedPostIds(postIds[postIds.length - 1]);
    }
  }
}
