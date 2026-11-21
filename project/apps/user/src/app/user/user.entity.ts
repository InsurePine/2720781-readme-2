import { compare, hash } from 'bcrypt';
import type {
  AuthUser,
  User,
} from '@project/shared-types' with { 'resolution-mode': 'import' };

export class UserEntity {
  constructor(private readonly data: AuthUser) {}

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
    const { id, email, firstName, lastName, avatarUrl, registeredAt } =
      this.data;
    return { id, email, firstName, lastName, avatarUrl, registeredAt };
  }
}
