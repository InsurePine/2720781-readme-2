import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo } from 'mongoose';
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

  async findComments(postId: string, offset: number, limit: number) {
    const filter = { postId };
    const [comments, total] = await Promise.all([
      this.comments
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(offset)
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

  async remove(postId: string, commentId: string) {
    if (!isValidObjectId(commentId)) return false;
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
