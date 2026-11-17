import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
  CommentPageDto,
  CommentResponseDto,
  CreateCommentDto,
  LikeCountDto,
} from './reactions.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('comments and likes')
@Controller('posts/:postId')
export class ReactionsController {
  constructor(private readonly reactions: ReactionsService) {}

  @Get('comments')
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Получить комментарии к публикации' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiOkResponse({ type: CommentPageDto })
  list(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.reactions.list(postId, page);
  }

  @Post('comments')
  @ApiBadRequestResponse({ description: 'Некорректный запрос.' })
  @ApiOperation({ summary: 'Добавить комментарий' })
  @ApiCreatedResponse({ type: CommentResponseDto })
  create(@Param('postId') postId: string, @Body() input: CreateCommentDto) {
    return this.reactions.create(postId, input.authorId, input.text);
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
    return this.reactions.like(postId, userId);
  }

  @Delete('likes/:userId')
  @ApiOperation({ summary: 'Снять лайк' })
  @ApiOkResponse({ type: LikeCountDto })
  unlike(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.reactions.unlike(postId, userId);
  }
}
