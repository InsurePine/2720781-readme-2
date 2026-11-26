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

export interface NewPost extends CreatePost {
  isRepost?: boolean;
  originalPostId?: string;
  originalAuthorId?: string;
}

export interface UpdatePost extends PostFields {
  status?: PostStatus;
  publishedAt?: string;
}

export type PostSort = 'date' | 'likes' | 'comments';

export interface PostFilters {
  page: number;
  limit: number;
  authorId?: string;
  type?: PostType;
  tag?: string;
  sort?: PostSort;
  status?: PostStatus;
  search?: string;
}

export interface PostStatistics {
  postId: string;
  likesCount: number;
  commentsCount: number;
}
