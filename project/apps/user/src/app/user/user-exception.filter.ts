import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from './user.errors';

@Catch(UserNotFoundError, EmailAlreadyExistsError, InvalidCredentialsError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(
    error:
      | UserNotFoundError
      | EmailAlreadyExistsError
      | InvalidCredentialsError,
    host: ArgumentsHost,
  ) {
    let statusCode = 401;
    let description = 'Unauthorized';
    if (error instanceof UserNotFoundError) {
      statusCode = 404;
      description = 'Not Found';
    } else if (error instanceof EmailAlreadyExistsError) {
      statusCode = 409;
      description = 'Conflict';
    }
    host.switchToHttp().getResponse().status(statusCode).json({
      statusCode,
      message: error.message,
      error: description,
    });
  }
}
