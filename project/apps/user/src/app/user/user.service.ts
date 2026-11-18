import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from './user.errors';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  get(id: string) {
    const user = this.users.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
