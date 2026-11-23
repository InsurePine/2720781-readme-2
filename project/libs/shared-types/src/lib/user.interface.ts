export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  registeredAt: string;
}

export interface UserWithPasswordHash extends User {
  passwordHash: string;
}

export interface UserDetails extends User {
  postsCount: number;
  followersCount: number;
}
