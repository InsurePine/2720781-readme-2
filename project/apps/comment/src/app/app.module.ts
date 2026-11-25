import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/comment/.env',
    }),
    ScheduleModule.forRoot(),
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
    ReactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
