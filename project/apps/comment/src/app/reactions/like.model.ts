import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'likes' })
export class LikeModel {
  @Prop({ required: true })
  postId!: string;

  @Prop({ required: true })
  userId!: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeModel);
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
