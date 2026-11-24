export class CommentNotFoundError extends Error {
  constructor() {
    super('Комментарий не найден');
  }
}

export class CommentPostNotFoundError extends Error {
  constructor() {
    super('Опубликованная запись не найдена');
  }
}

export class CommentForbiddenError extends Error {
  constructor() {
    super('Действие с чужой публикацией или комментарием запрещено');
  }
}
