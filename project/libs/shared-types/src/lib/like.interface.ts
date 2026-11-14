import { Post } from "./post.interface.js";
import { User } from "./user.interface.js";


export interface Like {
  postId: Post['id'];
  userId: User['id'];
}
