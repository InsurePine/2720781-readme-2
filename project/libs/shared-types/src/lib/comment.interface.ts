import { Post } from "./post.interface.js";
import { User } from "./user.interface.js";


export interface Comment {
  id: string;
  postId: Post['id'];
  authorId: User['id'];
  text: string;
  createdAt: string;
}
