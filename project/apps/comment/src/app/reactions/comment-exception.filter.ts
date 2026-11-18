import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CommentNotFoundError } from './comment.errors';

@Catch(CommentNotFoundError)
export class CommentExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(error: CommentNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    this.adapterHost.httpAdapter.reply(
      response,
      {
        statusCode: 404,
        message: error.message,
        error: 'Not Found',
      },
      404,
    );
  }
}
