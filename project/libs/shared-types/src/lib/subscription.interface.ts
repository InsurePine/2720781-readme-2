import { User } from "./user.interface.js";


export interface Subscription {
  subscriberId: User['id'];
  authorId: User['id'];
}
