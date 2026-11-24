import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommentExceptionFilter } from './comment-exception.filter';
import { StatisticsQueryDto, StatisticsResponseDto } from './reactions.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('comments and likes')
@UseFilters(CommentExceptionFilter)
@Controller('reactions')
export class StatisticsController {
  constructor(private readonly reactions: ReactionsService) {}

  @Get('statistics')
  @ApiOperation({
    summary: 'Получить счётчики лайков и комментариев для списка публикаций',
  })
  @ApiOkResponse({ type: [StatisticsResponseDto] })
  @ApiBadRequestResponse({
    description: 'Передайте от 1 до 100 UUID в postIds.',
  })
  async statistics(@Query() query: StatisticsQueryDto) {
    return this.reactions.statistics(query.postIds);
  }
}
