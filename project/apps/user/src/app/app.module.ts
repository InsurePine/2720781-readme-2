import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/user/.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.getOrThrow<string>('MONGO_HOST')}:${config.getOrThrow<string>('MONGO_PORT')}`,
        dbName: config.getOrThrow<string>('MONGO_DB'),
        user: config.getOrThrow<string>('MONGO_USER'),
        pass: config.getOrThrow<string>('MONGO_PASSWORD'),
        authSource: config.getOrThrow<string>('MONGO_AUTH_SOURCE'),
      }),
    }),
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
