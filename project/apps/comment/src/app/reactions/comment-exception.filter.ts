import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RelatedServiceUnavailableError } from '@project/shared-core';
import {
  CommentForbiddenError,
  CommentNotFoundError,
  CommentPostNotFoundError,
} from './comment.errors';

@Catch(
  CommentNotFoundError,
  CommentPostNotFoundError,
  CommentForbiddenError,
  RelatedServiceUnavailableError,
)
export class CommentExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    let statusCode = 404;
    let description = 'Not Found';
    if (error instanceof CommentForbiddenError) {
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
