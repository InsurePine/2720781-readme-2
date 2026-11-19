import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type {
  PostStatus,
  PostType,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

@Schema({ collection: 'posts' })
export class PostModel {
  @Prop({ required: true, type: String })
  type!: PostType;

  @Prop({ required: true })
  authorId!: string;

  @Prop({ required: true, type: String, default: 'published' })
  status!: PostStatus;

  @Prop({ required: true, default: Date.now })
  createdAt!: Date;

  @Prop({ required: true, default: Date.now })
  publishedAt!: Date;

  @Prop({ default: false })
  isRepost!: boolean;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  title?: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  announcement?: string;

  @Prop()
  text?: string;

  @Prop()
  quote?: string;

  @Prop()
  quoteAuthor?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  url?: string;

  @Prop()
  description?: string;
}

export type PostDocument = HydratedDocument<PostModel>;
export const PostSchema = SchemaFactory.createForClass(PostModel);
