import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreatePostDto,
  PostPageDto,
  PostResponseDto,
  UpdatePostDto,
} from './post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Получить опубликованные записи' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiOkResponse({ type: PostPageDto })
  list(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.posts.list(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiOkResponse({ type: PostResponseDto })
  get(@Param('id') id: string) {
    return this.posts.get(id);
  }

  @Post()
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Создать публикацию' })
  @ApiCreatedResponse({ type: PostResponseDto })
  create(@Body() input: CreatePostDto) {
    return this.posts.create(input);
  }

  @Patch(':id')
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Изменить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiOkResponse({ type: PostResponseDto })
  update(@Param('id') id: string, @Body() input: UpdatePostDto) {
    return this.posts.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить публикацию' })
  @ApiNotFoundResponse({ description: 'Объект не найден.' })
  @ApiNoContentResponse()
  delete(@Param('id') id: string) {
    this.posts.delete(id);
  }
}
