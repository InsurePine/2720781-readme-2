import type { Post } from '@project/shared-types' with { 'resolution-mode': 'import' };
import type { CreatePost, UpdatePost } from './post.types';

export class PostEntity {
  constructor(public readonly data: Post) {}

  static prepare(input: CreatePost) {
    return { ...input, tags: normalizeTags(input.tags ?? []) };
  }

  update(input: UpdatePost): void {
    const tags =
      input.tags === undefined ? this.data.tags : normalizeTags(input.tags);
    Object.assign(this.data, input, { tags });
  }
}

function normalizeTags(tags: string[]) {
  return [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  ];
}
