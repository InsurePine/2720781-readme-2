import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  private readonly users = new Map<string, UserEntity>();

  findById(id: string) {
    return this.users.get(id);
  }

  findByEmail(email: string) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  insert(user: UserEntity) {
    if (this.findByEmail(user.email)) return false;
    this.users.set(user.id, user);
    return true;
  }
}
