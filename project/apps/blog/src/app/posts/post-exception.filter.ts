import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { InvalidPostContentError, PostNotFoundError } from './post.errors';

@Catch(PostNotFoundError, InvalidPostContentError)
export class PostExceptionFilter implements ExceptionFilter {
  catch(
    error: PostNotFoundError | InvalidPostContentError,
    host: ArgumentsHost,
  ) {
    const missing = error instanceof PostNotFoundError;
    const statusCode = missing ? 404 : 400;
    host
      .switchToHttp()
      .getResponse()
      .status(statusCode)
      .json({
        statusCode,
        message: error.message,
        error: missing ? 'Not Found' : 'Bad Request',
      });
  }
}
