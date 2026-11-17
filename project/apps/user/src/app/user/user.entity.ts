import { randomUUID } from 'node:crypto';
import { compare, hash } from 'bcrypt';
import type {
  AuthUser,
  User,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

type NewUser = Pick<User, 'email' | 'firstName' | 'lastName'>;

export class UserEntity {
  private constructor(private readonly data: AuthUser) {}

  static async create(
    { email, firstName, lastName }: NewUser,
    password: string,
  ) {
    return new UserEntity({
      id: randomUUID(),
      email,
      firstName,
      lastName,
      registeredAt: new Date().toISOString(),
      passwordHash: await UserEntity.hashPassword(password),
    });
  }

  static hashPassword(password: string) {
    return hash(password, 12);
  }

  get id() {
    return this.data.id;
  }

  get email() {
    return this.data.email;
  }

  comparePassword(password: string) {
    return compare(password, this.data.passwordHash);
  }

  toUser(): User {
    const { id, email, firstName, lastName, registeredAt } = this.data;
    return { id, email, firstName, lastName, registeredAt };
  }
}
