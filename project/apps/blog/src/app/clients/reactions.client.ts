import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RelatedServiceUnavailableError } from '@project/shared-core';
import axios from 'axios';
import type { PostStatistics } from '../posts/post.types';

@Injectable()
export class ReactionsClient {
  private readonly url: string;

  constructor(
    config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.url = config.getOrThrow<string>('COMMENT_SERVICE_URL');
  }

  async getStatistics(postIds: string[]) {
    const result = new Map<string, PostStatistics>();
    try {
      for (let offset = 0; offset < postIds.length; offset += 100) {
        const { data } = await axios.get<PostStatistics[]>(
          `${this.url}/reactions/statistics`,
          {
            params: { postIds: postIds.slice(offset, offset + 100).join(',') },
            timeout: 5000,
          },
        );
        for (const statistics of data)
          result.set(statistics.postId, statistics);
      }
      return result;
    } catch {
      throw new RelatedServiceUnavailableError('Comment');
    }
  }

  async deleteForPost(postId: string, userId: string) {
    try {
      const token = await this.jwt.signAsync({ sub: userId, service: true });
      await axios.delete(`${this.url}/posts/${postId}/reactions`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
    } catch {
      throw new RelatedServiceUnavailableError('Comment');
    }
  }
}
