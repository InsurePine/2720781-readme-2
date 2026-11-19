import type { AuthUser } from '@project/shared-types' with { 'resolution-mode': 'import' };

export type NewUser = Pick<
  AuthUser,
  'email' | 'firstName' | 'lastName' | 'passwordHash'
>;
export type RegisterUser = Omit<NewUser, 'passwordHash'> & { password: string };
export type LoginUser = Pick<RegisterUser, 'email' | 'password'>;
