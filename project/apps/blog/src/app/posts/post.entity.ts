import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import type { CreatePost, NewPost, UpdatePost } from './post.types';

export class PostEntity {
  constructor(public readonly data: Post) {}

  static prepare(input: CreatePost) {
    return { ...input, tags: normalizeTags(input.tags ?? []) };
  }

  static prepareRepost(source: Post, authorId: string): NewPost {
    const {
      id,
      authorId: sourceAuthorId,
      createdAt,
      publishedAt,
      status,
      ...content
    } = source;
    return {
      ...content,
      authorId,
      isRepost: true,
      originalPostId: source.originalPostId ?? id,
      originalAuthorId: source.originalAuthorId ?? sourceAuthorId,
    };
  }

  update(input: UpdatePost): void {
    Object.assign(this.data, input);
    if (input.tags !== undefined) {
      this.data.tags = normalizeTags(input.tags);
    }
  }
}

function normalizeTags(tags: string[]) {
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()))];
}
