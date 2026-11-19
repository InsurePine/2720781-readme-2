export class CommentNotFoundError extends Error {
  constructor() {
    super('Комментарий не найден');
  }
}
