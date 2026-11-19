import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel, CommentSchema } from './comment.model';
import { LikeModel, LikeSchema } from './like.model';
import { ReactionsController } from './reactions.controller';
import { ReactionsRepository } from './reactions.repository';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentSchema },
      { name: LikeModel.name, schema: LikeSchema },
    ]),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionsRepository],
})
export class ReactionsModule {}
