import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isMongoId } from 'class-validator';

export interface AuthenticatedRequest {
  headers: { authorization?: string };
  user: { id: string; service?: boolean };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = /^Bearer\s+(\S+)$/i.exec(
      request.headers.authorization ?? '',
    )?.[1];
    
    if (!token) throw new UnauthorizedException('Передайте access token');
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        service?: boolean;
      }>(token, { algorithms: ['HS256'] });
      if (!isMongoId(payload.sub)) {
        throw new Error('Invalid token payload');
      }
      request.user = { id: payload.sub, service: payload.service === true };
      return true;
    } catch {
      throw new UnauthorizedException('Access token недействителен или истёк');
    }
  }
}
