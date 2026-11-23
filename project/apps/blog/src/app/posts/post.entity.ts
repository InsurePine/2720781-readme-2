import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import type { CreatePost, UpdatePost } from './post.types';

export class PostEntity {
  constructor(public readonly data: Post) {}

  static prepare(input: CreatePost) {
    return { ...input, tags: normalizeTags(input.tags ?? []) };
  }

  update(input: UpdatePost) {
    return new PostEntity({
      ...this.data,
      ...input,
      tags:
        input.tags === undefined ? this.data.tags : normalizeTags(input.tags),
    } as Post);
  }
}

function normalizeTags(tags: string[]) {
  return [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  ];
}
