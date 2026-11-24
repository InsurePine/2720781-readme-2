import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@project/shared-core';
import { BlogClient } from '../clients/blog.client';
import { StatisticsController } from './statistics.controller';
import { CommentModel, CommentSchema } from './comment.model';
import { LikeModel, LikeSchema } from './like.model';
import { ReactionsController } from './reactions.controller';
import { ReactionsRepository } from './reactions.repository';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentSchema },
      { name: LikeModel.name, schema: LikeSchema },
    ]),
  ],
  controllers: [ReactionsController, StatisticsController],
  providers: [ReactionsService, ReactionsRepository, BlogClient],
})
export class ReactionsModule {}
