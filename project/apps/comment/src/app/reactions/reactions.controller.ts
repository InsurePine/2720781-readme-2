import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CommentPageDto,
  CommentResponseDto,
  CreateCommentDto,
  LikeCountDto,
} from './reactions.dto';
import { CommentExceptionFilter } from './comment-exception.filter';
import { CommentQueryDto } from './comment-query.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('comments and likes')
@UseFilters(CommentExceptionFilter)
@Controller('posts/:postId')
export class ReactionsController {
  constructor(private readonly reactions: ReactionsService) {}

  @Get('comments')
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Получить комментарии к публикации' })
  @ApiOkResponse({ type: CommentPageDto })
  list(@Param('postId') postId: string, @Query() query: CommentQueryDto) {
    const result = this.reactions.list(postId, query.page);
    return {
      items: result.items.map((comment) => ({ ...comment })),
      page: query.page,
      total: result.total,
    };
  }

  @Post('comments')
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Добавить комментарий' })
  @ApiCreatedResponse({ type: CommentResponseDto })
  create(@Param('postId') postId: string, @Body() input: CreateCommentDto) {
    const comment = this.reactions.create(postId, input.authorId, input.text);
    return { ...comment };
  }

  @Delete('comments/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить комментарий' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiNoContentResponse()
  delete(@Param('postId') postId: string, @Param('id') id: string) {
    this.reactions.delete(postId, id);
  }

  @Put('likes/:userId')
  @ApiOperation({ summary: 'Поставить лайк' })
  @ApiOkResponse({ type: LikeCountDto })
  like(@Param('postId') postId: string, @Param('userId') userId: string) {
    return { likesCount: this.reactions.like(postId, userId) };
  }

  @Delete('likes/:userId')
  @ApiOperation({ summary: 'Снять лайк' })
  @ApiOkResponse({ type: LikeCountDto })
  unlike(@Param('postId') postId: string, @Param('userId') userId: string) {
    return { likesCount: this.reactions.unlike(postId, userId) };
  }
}
