import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../user/user.errors';
import { UserRepository } from '../user/user.repository';
import type { LoginUser, RegisterUser } from '../user/user.types';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async register({ password, ...input }: RegisterUser) {
    const user = await this.users.create({
      ...input,
      passwordHash: await hash(password, 12),
    });
    if (!user) throw new EmailAlreadyExistsError();
    return user;
  }

  async login({ email, password }: LoginUser) {
    const user = await this.users.findByEmail(email);
    if (!user || !(await compare(password, user.passwordHash)))
      throw new InvalidCredentialsError();
    return this.jwt.signAsync({ sub: user.id });
  }
}
