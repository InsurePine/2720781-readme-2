import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUserId,
  JwtAuthGuard,
  ServiceAuthGuard,
} from '@project/shared-core';
import {
  CreatePostDto,
  PostDetailsDto,
  PostPageDto,
  PostResponseDto,
  UpdatePostDto,
} from './post.dto';
import { PostExceptionFilter } from './post-exception.filter';
import { PostQueryDto, SearchPostQueryDto } from './post-query.dto';
import type { PostWithStatistics } from './post.repository';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBadRequestResponse({
  description: 'Некорректные поля, параметры или UUID.',
})
@ApiNotFoundResponse({ description: 'Публикация не найдена.' })
@UseFilters(PostExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Опубликованные записи: фильтры, сортировка и пагинация',
  })
  @ApiOkResponse({ type: PostPageDto })
  @ApiServiceUnavailableResponse({
    description: 'Связанный сервис Comment недоступен.',
  })
  async list(@Query() query: PostQueryDto) {
    return this.toPageResponse(await this.posts.list(query), query);
  }

  @Get('search')
  @ApiOperation({
    summary:
      'Поиск опубликованных записей по словам из заголовка; до 20 записей',
  })
  @ApiOkResponse({ type: PostPageDto })
  @ApiServiceUnavailableResponse({
    description: 'Связанный сервис Comment недоступен.',
  })
  async search(@Query() query: SearchPostQueryDto) {
    return this.toPageResponse(
      await this.posts.list({ ...query, search: query.query }),
      query,
    );
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить собственные черновики' })
  @ApiOkResponse({ type: PostPageDto })
  @ApiServiceUnavailableResponse({
    description: 'Связанный сервис Comment недоступен.',
  })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async drafts(@CurrentUserId() userId: string, @Query() query: PostQueryDto) {
    return this.toPageResponse(await this.posts.drafts(userId, query), query);
  }

  @Get('deleted')
  @UseGuards(ServiceAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Служебный список: до 100 ID удалённых публикаций',
  })
  @ApiQuery({
    name: 'afterId',
    required: false,
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiOkResponse({ type: [String] })
  @ApiUnauthorizedResponse({ description: 'Необходим служебный токен.' })
  @ApiForbiddenResponse({ description: 'Маршрут доступен только сервисам.' })
  getDeletedPostIds(
    @Query('afterId', new ParseUUIDPipe({ version: '4', optional: true }))
    afterId?: string,
  ) {
    return this.posts.getDeletedPostIds(afterId);
  }

  @Head(':id')
  @ApiOperation({
    summary:
      'Проверить наличие опубликованной записи без загрузки её содержимого',
  })
  @ApiOkResponse({
    description: 'Публикация существует и опубликована. Ответ без тела.',
  })
  async checkPublished(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.posts.getPublished(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить опубликованную запись со счётчиками реакций',
  })
  @ApiOkResponse({ type: PostDetailsDto })
  @ApiServiceUnavailableResponse({
    description: 'Связанный сервис Comment недоступен.',
  })
  async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.toHttpResponse(await this.posts.get(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать публикацию; автор определяется из access token',
  })
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  async create(@CurrentUserId() userId: string, @Body() input: CreatePostDto) {
    return (await this.posts.create({ ...input, authorId: userId })).data;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить собственную публикацию' })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  @ApiForbiddenResponse({
    description: 'Публикация принадлежит другому пользователю.',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUserId() userId: string,
    @Body() input: UpdatePostDto,
  ) {
    return (await this.posts.update(id, userId, input)).data;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Пометить собственную публикацию удалённой',
    description: 'Comment удаляет связанные реакции по расписанию.',
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  @ApiForbiddenResponse({
    description: 'Публикация принадлежит другому пользователю.',
  })
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUserId() userId: string,
  ) {
    await this.posts.delete(id, userId);
  }

  @Post(':id/reposts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Репостнуть чужую опубликованную запись один раз' })
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Необходим access token.' })
  @ApiForbiddenResponse({
    description: 'Нельзя репостить собственную публикацию.',
  })
  @ApiConflictResponse({ description: 'Повторный репост запрещён.' })
  async repost(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUserId() userId: string,
  ) {
    return (await this.posts.repost(id, userId)).data;
  }

  private toHttpResponse({ post, ...statistics }: PostWithStatistics) {
    return { ...post.data, ...statistics };
  }

  private toPageResponse(
    result: { items: PostWithStatistics[]; total: number },
    query: { page: number; limit: number },
  ) {
    return {
      items: result.items.map((post) => this.toHttpResponse(post)),
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    };
  }
}
