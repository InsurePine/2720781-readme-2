import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../user/user.errors';
import { UserRepository } from '../user/user.repository';
import type { LoginUser, RegisterUser } from '../user/user.types';

@Injectable()
export class AuthenticationService {
  constructor(private readonly users: UserRepository) {}

  async register(input: RegisterUser) {
    const user = await UserEntity.create(input, input.password);
    if (!this.users.insert(user)) throw new EmailAlreadyExistsError();
    return user;
  }

  async login({ email, password }: LoginUser) {
    const user = this.users.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new InvalidCredentialsError();
    }
    return user;
  }
}
