import type { Comment } from '@project/shared-types' with { 'resolution-mode': 'import' };

export class CommentEntity {
  constructor(public readonly data: Comment) {}
}
