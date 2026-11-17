import { randomUUID } from 'node:crypto';
import type { Comment } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class CommentEntity implements Comment {
  readonly id = randomUUID();
  readonly createdAt = new Date().toISOString();

  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly text: string,
  ) {}
}
