export class PostNotFoundError extends Error {
  constructor() {
    super('Публикация не найдена');
  }
}

export class PostForbiddenError extends Error {
  constructor() {
    super('Действие с этой публикацией запрещено');
  }
}

export class PostAlreadyRepostedError extends Error {
  constructor() {
    super('Публикация уже была репостнута этим пользователем');
  }
}
