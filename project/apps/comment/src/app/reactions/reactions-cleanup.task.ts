import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReactionsService } from './reactions.service';

@Injectable()
export class ReactionsCleanupTask {
  constructor(private readonly reactions: ReactionsService) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'cleanup-deleted-post-reactions',
    waitForCompletion: true,
  })
  cleanup() {
    return this.reactions.removeDeletedPostReactions();
  }
}
