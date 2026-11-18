import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidPostContentError, PostNotFoundError } from './post.errors';

@Catch(PostNotFoundError, InvalidPostContentError)
export class PostExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(
    error: PostNotFoundError | InvalidPostContentError,
    host: ArgumentsHost,
  ) {
    const statusCode = error instanceof PostNotFoundError ? 404 : 400;
    const response = host.switchToHttp().getResponse();
    this.adapterHost.httpAdapter.reply(
      response,
      {
        statusCode,
        message: error.message,
        error: statusCode === 404 ? 'Not Found' : 'Bad Request',
      },
      statusCode,
    );
  }
}
