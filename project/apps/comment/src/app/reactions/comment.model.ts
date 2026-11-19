import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ collection: 'comments' })
export class CommentModel {
  @Prop({ required: true })
  postId!: string;

  @Prop({ required: true })
  authorId!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ required: true, default: Date.now })
  createdAt!: Date;
}

export type CommentDocument = HydratedDocument<CommentModel>;
export const CommentSchema = SchemaFactory.createForClass(CommentModel);
