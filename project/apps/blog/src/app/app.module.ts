import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/blog/.env',
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
    PostsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
