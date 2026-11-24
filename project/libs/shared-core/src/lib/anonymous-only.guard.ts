import { ForbiddenException, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './jwt-auth.guard';

@Injectable()
export class AnonymousOnlyGuard implements CanActivate {
  constructor(private readonly authentication: JwtAuthGuard) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.headers.authorization) return true;
    await this.authentication.canActivate(context);
    throw new ForbiddenException('Регистрация доступна анонимным клиентам');
  }
}
