import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string } }>();
    const token = /^Bearer\s+(\S+)$/i.exec(
      request.headers.authorization ?? '',
    )?.[1];
    if (!token) throw new UnauthorizedException('Передайте служебный токен');

    let payload: { service?: boolean };
    try {
      payload = await this.jwt.verifyAsync<{ service?: boolean }>(token, {
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException(
        'Служебный токен недействителен или истёк',
      );
    }
    if (payload.service !== true)
      throw new ForbiddenException('Маршрут доступен только другим сервисам');
    return true;
  }
}
