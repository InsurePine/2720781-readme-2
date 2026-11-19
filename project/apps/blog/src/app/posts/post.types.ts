import type {
  PostStatus,
  PostType,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

export interface PostFields {
  title?: string;
  videoUrl?: string;
  announcement?: string;
  text?: string;
  quote?: string;
  quoteAuthor?: string;
  imageUrl?: string;
  url?: string;
  description?: string;
  tags?: string[];
}

export interface CreatePost extends PostFields {
  type: PostType;
  authorId: string;
}

export interface UpdatePost extends PostFields {
  status?: PostStatus;
}
