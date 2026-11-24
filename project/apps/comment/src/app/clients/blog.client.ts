import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RelatedServiceUnavailableError } from '@project/shared-core';
import axios from 'axios';
import { CommentPostNotFoundError } from '../reactions/comment.errors';

@Injectable()
export class BlogClient {
  private readonly url: string;

  constructor(config: ConfigService) {
    this.url = config.getOrThrow<string>('BLOG_SERVICE_URL');
  }

  async requirePublished(postId: string) {
    try {
      await axios.head(`${this.url}/posts/${postId}`, {
        timeout: 5000,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404)
        throw new CommentPostNotFoundError();
      throw new RelatedServiceUnavailableError('Blog');
    }
  }
}
