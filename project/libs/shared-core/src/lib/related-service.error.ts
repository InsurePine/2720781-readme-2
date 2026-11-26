export class RelatedServiceUnavailableError extends Error {
  constructor(service: string) {
    super(`Сервис ${service} недоступен`);
  }
}
