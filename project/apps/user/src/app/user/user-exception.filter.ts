import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from './user.errors';

@Catch(
  UserNotFoundError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidRefreshTokenError,
)
export class UserExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
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
