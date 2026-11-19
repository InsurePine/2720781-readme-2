import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from './user.errors';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  async get(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
