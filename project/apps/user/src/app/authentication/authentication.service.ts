import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import type { LoginDto, RegisterDto } from './authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    if (
      !firstName ||
      !lastName ||
      Array.from(`${firstName} ${lastName}`).length > 50
    ) {
      throw new BadRequestException(
        'Укажите имя и фамилию общей длиной до 50 символов',
      );
    }

    const user = await UserEntity.create(
      { ...input, firstName, lastName },
      input.password,
    );
    if (!this.users.insert(user)) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    return user.toUser();
  }

  async login({ email, password }: LoginDto) {
    const user = this.users.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return { accessToken: await this.jwt.signAsync({ sub: user.id }) };
  }
}
