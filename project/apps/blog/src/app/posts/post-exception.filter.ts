import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RelatedServiceUnavailableError } from '@project/shared-core';
import {
  PostAlreadyRepostedError,
  PostForbiddenError,
  PostNotFoundError,
} from './post.errors';

@Catch(
  PostNotFoundError,
  PostForbiddenError,
  PostAlreadyRepostedError,
  RelatedServiceUnavailableError,
)
export class PostExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    let statusCode = 409;
    let description = 'Conflict';
    if (error instanceof PostNotFoundError) {
      statusCode = 404;
      description = 'Not Found';
    } else if (error instanceof PostForbiddenError) {
      statusCode = 403;
      description = 'Forbidden';
    } else if (error instanceof RelatedServiceUnavailableError) {
      statusCode = 503;
      description = 'Service Unavailable';
    }
    host
      .switchToHttp()
      .getResponse()
      .status(statusCode)
      .json({ statusCode, message: error.message, error: description });
  }
}
