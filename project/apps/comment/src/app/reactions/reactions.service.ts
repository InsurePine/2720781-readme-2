import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { ReactionsRepository } from './reactions.repository';

const PAGE_SIZE = 50;

@Injectable()
export class ReactionsService {
  constructor(private readonly reactions: ReactionsRepository) {}

  list(postId: string, page: number) {
    if (page < 1)
      throw new BadRequestException('Номер страницы должен быть не меньше 1');
    const comments = this.reactions.list(postId).reverse();
    return {
      items: comments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      page,
      total: comments.length,
    };
  }

  create(postId: string, authorId: string, text: string) {
    return this.reactions.add(new CommentEntity(postId, authorId, text));
  }

  delete(postId: string, id: string) {
    const comment = this.reactions.find(id);
    if (!comment || comment.postId !== postId)
      throw new NotFoundException('Комментарий не найден');
    this.reactions.remove(id);
  }

  like(postId: string, userId: string) {
    return { likesCount: this.reactions.like({ postId, userId }) };
  }

  unlike(postId: string, userId: string) {
    return { likesCount: this.reactions.unlike({ postId, userId }) };
  }
}
