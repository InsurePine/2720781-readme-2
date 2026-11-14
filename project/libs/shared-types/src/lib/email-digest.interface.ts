import { Post } from "./post.interface.js";
import { User } from "./user.interface.js";



export interface EmailDigest {
  recipientEmail: User['email'];
  posts: (Post & { status: 'published' })[];
}
