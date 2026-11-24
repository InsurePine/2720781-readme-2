import { Module } from '@nestjs/common';
import { AuthModule } from '@project/shared-core';
import { ReactionsClient } from '../clients/reactions.client';
import { PostRepository } from './post.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [AuthModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, ReactionsClient],
})
export class PostsModule {}
