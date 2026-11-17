import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';

const PAGE_SIZE = 25;

@Injectable()
export class PostsService {
  constructor(private readonly posts: PostRepository) {}

  list(page: number) {
    if (page < 1)
      throw new BadRequestException('Номер страницы должен быть не меньше 1');
    const items = this.posts
      .list()
      .map((post) => post.data)
      .filter((post) => post.status === 'published')
      .sort((first, second) =>
        second.publishedAt.localeCompare(first.publishedAt),
      );
    return {
      items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      page,
      total: items.length,
    };
  }

  get(id: string) {
    const post = this.posts.find(id);
    if (post?.data.status !== 'published')
      throw new NotFoundException('Публикация не найдена');
    return post.data;
  }

  create(input: CreatePostDto) {
    return this.posts.save(PostEntity.create(input)).data;
  }

  update(id: string, input: UpdatePostDto) {
    const post = this.find(id);
    return this.posts.save(post.update(input)).data;
  }

  delete(id: string) {
    this.find(id);
    this.posts.remove(id);
  }

  private find(id: string) {
    const post = this.posts.find(id);
    if (!post) throw new NotFoundException('Публикация не найдена');
    return post;
  }
}
