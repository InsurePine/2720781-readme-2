import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from './user.errors';

@Catch(UserNotFoundError, EmailAlreadyExistsError, InvalidCredentialsError)
export class UserExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(
    error:
      | UserNotFoundError
      | EmailAlreadyExistsError
      | InvalidCredentialsError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse();
    let statusCode = 401;
    let description = 'Unauthorized';

    if (error instanceof UserNotFoundError) {
      statusCode = 404;
      description = 'Not Found';
    } else if (error instanceof EmailAlreadyExistsError) {
      statusCode = 409;
      description = 'Conflict';
    }

    this.adapterHost.httpAdapter.reply(
      response,
      {
        statusCode,
        message: error.message,
        error: description,
      },
      statusCode,
    );
  }
}
