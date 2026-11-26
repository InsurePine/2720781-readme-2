import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RelatedServiceUnavailableError } from '@project/shared-core';
import axios from 'axios';
import { CommentPostNotFoundError } from '../reactions/comment.errors';

@Injectable()
export class BlogClient {
  private readonly url: string;

  constructor(
    config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.url = config.getOrThrow<string>('BLOG_SERVICE_URL');
  }

  async getDeletedPostIds(afterId?: string) {
    try {
      const token = await this.jwt.signAsync({ sub: 'comment', service: true });
      const { data } = await axios.get<string[]>(`${this.url}/posts/deleted`, {
        params: { afterId },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      return data;
    } catch {
      throw new RelatedServiceUnavailableError('Blog');
    }
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
