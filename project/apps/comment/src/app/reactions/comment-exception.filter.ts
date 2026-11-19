import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { CommentNotFoundError } from './comment.errors';

@Catch(CommentNotFoundError)
export class CommentExceptionFilter implements ExceptionFilter {
  catch(error: CommentNotFoundError, host: ArgumentsHost) {
    host.switchToHttp().getResponse().status(404).json({
      statusCode: 404,
      message: error.message,
      error: 'Not Found',
    });
  }
}
