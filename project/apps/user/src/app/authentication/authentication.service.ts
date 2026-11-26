import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { createHash, randomUUID } from 'node:crypto';
import { isMongoId } from 'class-validator';
import type {
  TokenPair,
  TokenPayload,
} from '@project/shared-types' with { 'resolution-mode': 'import' };
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from '../user/user.errors';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import type { LoginUser, RegisterUser } from '../user/user.types';

@Injectable()
export class AuthenticationService {
  private readonly refreshSecret: string;

  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.refreshSecret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
    if (this.refreshSecret === config.get('JWT_SECRET')) {
      throw new Error('JWT_REFRESH_SECRET должен отличаться от JWT_SECRET');
    }
  }

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
    return this.createTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: TokenPayload;
    try {
      payload = await this.jwt.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.refreshSecret,
        algorithms: ['HS256'],
      });
      if (!isMongoId(payload.sub)) {
        throw new Error('Invalid refresh token payload');
      }
    } catch {
      throw new InvalidRefreshTokenError();
    }
    const user = await this.users.consumeRefreshToken(
      payload.sub,
      this.hashToken(refreshToken),
    );
    if (!user) throw new InvalidRefreshTokenError();
    return this.createTokens(user);
  }

  async logout(userId: string) {
    await this.users.clearRefreshToken(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    const passwordMatches = await compare(currentPassword, user.passwordHash);
    if (!passwordMatches) throw new InvalidPasswordError();
    const passwordHash = await hash(newPassword, 12);
    await this.users.updatePassword(userId, passwordHash);
  }

  private async createTokens(user: UserEntity): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      jti: randomUUID(),
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti: randomUUID() },
      { secret: this.refreshSecret, expiresIn: 604800 },
    );
    await this.users.saveRefreshToken(user.id, this.hashToken(refreshToken));
    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
