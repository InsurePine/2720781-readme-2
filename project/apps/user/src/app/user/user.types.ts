import type { UserWithPasswordHash } from '@project/shared-types' with { 'resolution-mode': 'import' };

export type NewUser = Pick<
  UserWithPasswordHash,
  'email' | 'firstName' | 'lastName' | 'avatarUrl' | 'passwordHash'
>;
export type RegisterUser = Omit<NewUser, 'passwordHash'> & { password: string };
export type LoginUser = Pick<RegisterUser, 'email' | 'password'>;
