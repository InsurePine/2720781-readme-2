import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { PostNotFoundError } from './post.errors';

@Catch(PostNotFoundError)
export class PostExceptionFilter implements ExceptionFilter {
  catch(error: PostNotFoundError, host: ArgumentsHost) {
    host.switchToHttp().getResponse().status(404).json({
      statusCode: 404,
      message: error.message,
      error: 'Not Found',
    });
  }
}
