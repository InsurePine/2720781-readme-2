import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AnonymousOnlyGuard } from './anonymous-only.guard';
import { ServiceAuthGuard } from './service-auth.guard';
import { MongoIdValidationPipe } from './mongo-id-validation.pipe';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { algorithm: 'HS256' as const, expiresIn: 900 },
      }),
    }),
  ],
  providers: [
    JwtAuthGuard,
    AnonymousOnlyGuard,
    ServiceAuthGuard,
    MongoIdValidationPipe,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    AnonymousOnlyGuard,
    ServiceAuthGuard,
    MongoIdValidationPipe,
  ],
})
export class AuthModule {}
