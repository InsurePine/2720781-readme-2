import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import type { Like } from '@project/shared-types' with { 'resolution-mode': 'import' };
import { CommentEntity } from './comment.entity';
import { CommentModel } from './comment.model';
import type { CommentDocument } from './comment.model';
import { LikeModel } from './like.model';

@Injectable()
export class ReactionsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly comments: Model<CommentModel>,
    @InjectModel(LikeModel.name) private readonly likes: Model<LikeModel>,
  ) {}

  async findComments(postId: string, page: number, limit: number) {
    const filter = { postId };
    const [comments, total] = await Promise.all([
      this.comments
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.comments.countDocuments(filter).exec(),
    ]);
    return { items: comments.map((comment) => this.toEntity(comment)), total };
  }

  async add(postId: string, authorId: string, text: string) {
    return this.toEntity(
      await this.comments.create({ postId, authorId, text }),
    );
  }

  async findById(postId: string, commentId: string) {
    const comment = await this.comments
      .findOne({ _id: commentId, postId })
      .exec();
    return comment ? this.toEntity(comment) : null;
  }

  async remove(postId: string, commentId: string) {
    const result = await this.comments
      .deleteOne({ _id: commentId, postId })
      .exec();
    return result.deletedCount > 0;
  }

  async like(input: Like) {
    await this.likes.init();
    try {
      await this.likes.create(input);
    } catch (error) {
      if (!(error instanceof mongo.MongoServerError && error.code === 11000))
        throw error;
    }
    return this.likes.countDocuments({ postId: input.postId }).exec();
  }

  async unlike(input: Like) {
    await this.likes.deleteOne(input).exec();
    return this.likes.countDocuments({ postId: input.postId }).exec();
  }

  async getStatistics(postIds: string[]) {
    const [comments, likes] = await Promise.all([
      this.comments
        .aggregate<{
          _id: string;
          count: number;
        }>([{ $match: { postId: { $in: postIds } } }, { $group: { _id: '$postId', count: { $sum: 1 } } }])
        .exec(),
      this.likes
        .aggregate<{
          _id: string;
          count: number;
        }>([{ $match: { postId: { $in: postIds } } }, { $group: { _id: '$postId', count: { $sum: 1 } } }])
        .exec(),
    ]);
    const commentCounts = new Map(
      comments.map((item) => [item._id, item.count]),
    );
    const likeCounts = new Map(likes.map((item) => [item._id, item.count]));
    return [...new Set(postIds)].map((postId) => ({
      postId,
      likesCount: likeCounts.get(postId) ?? 0,
      commentsCount: commentCounts.get(postId) ?? 0,
    }));
  }

  async removeForPost(postId: string) {
    await Promise.all([
      this.comments.deleteMany({ postId }).exec(),
      this.likes.deleteMany({ postId }).exec(),
    ]);
  }

  private toEntity(comment: CommentDocument) {
    return new CommentEntity({
      id: comment._id.toString(),
      postId: comment.postId,
      authorId: comment.authorId,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    });
  }
}
