export class PostNotFoundError extends Error {
  constructor() {
    super('Публикация не найдена');
  }
}

export class InvalidPostContentError extends Error {
  constructor(field: string) {
    super(`Заполните поле ${field}`);
  }
}
