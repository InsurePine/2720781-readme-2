import { User } from "./user.interface.js";


export type PostStatus = 'published' | 'draft';


export type Tag = string;

interface PostBase {
  id: string;
  authorId: User['id'];
  status: PostStatus;
  createdAt: string;
  publishedAt: string;
  tags: Tag[];
}

interface VideoContent {
  type: 'video';
  title: string;
  videoUrl: string;
}

interface TextContent {
  type: 'text';
  title: string;
  announcement: string;
  text: string;
}

interface QuoteContent {
  type: 'quote';
  quote: string;
  quoteAuthor: string;
}

interface PhotoContent {
  type: 'photo';
  imageUrl: string;
}

interface LinkContent {
  type: 'link';
  url: string;
  description?: string;
}

interface OriginalPost {
  isRepost: false;
  originalPostId?: never;
  originalAuthorId?: never;
}

interface Repost {
  isRepost: true;
  originalPostId: PostBase['id'];
  originalAuthorId: User['id'];
}

type PostMetadata = PostBase & (OriginalPost | Repost);

export type VideoPost = PostMetadata & VideoContent;
export type TextPost = PostMetadata & TextContent;
export type QuotePost = PostMetadata & QuoteContent;
export type PhotoPost = PostMetadata & PhotoContent;
export type LinkPost = PostMetadata & LinkContent;

export type Post = VideoPost | TextPost | QuotePost | PhotoPost | LinkPost;
export type PostType = Post['type'];

export interface PostStats {
  likesCount: number;
  commentsCount: number;
}


export type PostDetails = Post & PostStats & {
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
};
