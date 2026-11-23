export class PostNotFoundError extends Error {
  constructor() {
    super('Публикация не найдена');
  }
}
