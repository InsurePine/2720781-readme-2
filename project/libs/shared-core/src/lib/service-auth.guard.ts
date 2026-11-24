import { ForbiddenException, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './jwt-auth.guard';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(private readonly authentication: JwtAuthGuard) {}

  async canActivate(context: ExecutionContext) {
    await this.authentication.canActivate(context);
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user.service)
      throw new ForbiddenException('Маршрут доступен только другим сервисам');
    return true;
  }
}
