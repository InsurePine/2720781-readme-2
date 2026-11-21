import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import { PostEntity } from './post.entity';
import { PostModel } from './post.model';
import type { PostDocument } from './post.model';
import type { CreatePost } from './post.types';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostModel.name) private readonly posts: Model<PostModel>,
  ) {}

  async findPublished(offset: number, limit: number) {
    const filter = { status: 'published' as const };
    const [posts, total] = await Promise.all([
      this.posts
        .find(filter)
        .sort({ publishedAt: -1, _id: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.posts.countDocuments(filter).exec(),
    ]);
    return { items: posts.map((post) => this.toEntity(post)), total };
  }

  async find(id: string) {
    if (!isValidObjectId(id)) return null;
    const post = await this.posts.findById(id).exec();
    return post ? this.toEntity(post) : null;
  }

  async create(input: CreatePost) {
    return this.toEntity(await this.posts.create(input));
  }

  async save(post: PostEntity) {
    const { id, ...data } = post.data;
    const saved = await this.posts
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    return saved ? this.toEntity(saved) : null;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) return false;
    const result = await this.posts.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  private toEntity(post: PostDocument) {
    const { _id, createdAt, publishedAt, ...data } = post.toObject({
      versionKey: false,
    });
    return new PostEntity({
      ...data,
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      publishedAt: publishedAt.toISOString(),
    } as Post);
  }
}
