import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tags = [
  { id: '20000000-0000-4000-8000-000000000001', name: 'nestjs' },
  { id: '20000000-0000-4000-8000-000000000002', name: 'postgresql' },
  { id: '20000000-0000-4000-8000-000000000003', name: 'prisma' },
];

const posts = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    type: 'text',
    authorId: '507f1f77bcf86cd799439011',
    title: 'Первый пост о NestJS',
    announcement: 'Знакомство с приложением.',
    text: 'Учимся создавать REST API на NestJS.',
    tags: ['nestjs', 'prisma'],
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    type: 'link',
    authorId: '507f1f77bcf86cd799439012',
    url: 'https://www.postgresql.org/docs/14/',
    description: 'Документация PostgreSQL 14.',
    tags: ['postgresql'],
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    type: 'text',
    authorId: '507f1f77bcf86cd799439013',
    title: 'Prisma и PostgreSQL',
    announcement: 'Работа с реляционной базой.',
    text: 'Описываем модели и выполняем запросы через Prisma Client.',
    tags: ['prisma', 'postgresql'],
  },
] as const;

async function fillDatabase() {
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  for (const { tags: names, ...post } of posts) {
    const data = {
      ...post,
      tags: { connect: names.map((name) => ({ name })) },
    };
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: data,
    });
  }

  console.log('Добавлены 3 тега и 3 публикации.');
}

fillDatabase()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
