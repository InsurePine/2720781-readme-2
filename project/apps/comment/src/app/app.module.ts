import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [ReactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
