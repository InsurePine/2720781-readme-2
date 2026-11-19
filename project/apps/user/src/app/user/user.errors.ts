export class UserNotFoundError extends Error {
  constructor() {
    super('Пользователь не найден');
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Пользователь с таким email уже существует');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Неверный email или пароль');
  }
}
