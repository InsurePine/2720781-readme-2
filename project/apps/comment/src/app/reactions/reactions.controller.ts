import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUserId,
  JwtAuthGuard,
  MongoIdValidationPipe,
  ServiceAuthGuard,
} from '@project/shared-core';
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
@ApiBadRequestResponse({
  description: 'Некорректный ID, тело запроса или параметры пагинации.',
})
@ApiNotFoundResponse({ description: 'Публикация или комментарий не найдены.' })
@ApiServiceUnavailableResponse({
  description: 'Связанный сервис Blog недоступен.',
})
@UseFilters(CommentExceptionFilter)
@Controller('posts/:postId')
export class ReactionsController {
  constructor(private readonly reactions: ReactionsService) {}

  @Get('comments')
  @ApiOperation({
    summary: 'Получить комментарии опубликованной записи; до 50 на странице',
  })
  @ApiOkResponse({ type: CommentPageDto })
  async list(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
    @Query() query: CommentQueryDto,
  ) {
    const result = await this.reactions.listComments(
      postId,
      query.page,
      query.limit,
    );
    return {
      items: result.items.map((comment) => comment.data),
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    };
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Добавить комментарий; автор определяется из access token',
  })
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async create(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
    @CurrentUserId() userId: string,
    @Body() input: CreateCommentDto,
  ) {
    return (await this.reactions.createComment(postId, userId, input.text))
      .data;
  }

  @Delete('comments/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить собственный комментарий' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  @ApiForbiddenResponse({
    description: 'Комментарий принадлежит другому пользователю.',
  })
  async delete(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
    @Param('id', MongoIdValidationPipe) commentId: string,
    @CurrentUserId() userId: string,
  ) {
    await this.reactions.deleteComment(postId, commentId, userId);
  }

  @Put('likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поставить один лайк от текущего пользователя' })
  @ApiOkResponse({ type: LikeCountDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async like(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
    @CurrentUserId() userId: string,
  ) {
    return { likesCount: await this.reactions.like(postId, userId) };
  }

  @Delete('likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Убрать собственный лайк' })
  @ApiOkResponse({ type: LikeCountDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async unlike(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
    @CurrentUserId() userId: string,
  ) {
    return { likesCount: await this.reactions.unlike(postId, userId) };
  }

  @Delete('reactions')
  @HttpCode(204)
  @UseGuards(ServiceAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Служебное удаление реакций; право на удаление публикации проверяет Blog',
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  @ApiForbiddenResponse({
    description: 'Необходим служебный токен.',
  })
  async deleteForPost(
    @Param('postId', new ParseUUIDPipe({ version: '4' })) postId: string,
  ) {
    await this.reactions.deleteForPost(postId);
  }
}
