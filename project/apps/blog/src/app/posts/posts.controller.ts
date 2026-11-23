import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreatePostDto,
  PostPageDto,
  PostResponseDto,
  UpdatePostDto,
} from './post.dto';
import { PostExceptionFilter } from './post-exception.filter';
import { PostQueryDto } from './post-query.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@UseFilters(PostExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить опубликованные записи' })
  @ApiOkResponse({ type: PostPageDto })
  async list(@Query() query: PostQueryDto) {
    const page = Number(query.page ?? 1);
    const result = await this.posts.list(page);
    return {
      items: result.items.map((post) => post.data),
      page,
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiOkResponse({ type: PostResponseDto })
  async get(@Param('id') id: string) {
    return (await this.posts.get(id)).data;
  }

  @Post()
  @ApiOperation({ summary: 'Создать публикацию' })
  @ApiCreatedResponse({ type: PostResponseDto })
  async create(@Body() input: CreatePostDto) {
    return (await this.posts.create(input)).data;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Изменить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiOkResponse({ type: PostResponseDto })
  async update(@Param('id') id: string, @Body() input: UpdatePostDto) {
    return (await this.posts.update(id, input)).data;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiNoContentResponse()
  async delete(@Param('id') id: string) {
    await this.posts.delete(id);
  }
}
