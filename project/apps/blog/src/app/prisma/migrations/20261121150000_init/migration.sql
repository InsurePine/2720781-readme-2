CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "PostType" AS ENUM ('video', 'text', 'quote', 'photo', 'link');

CREATE TYPE "PostStatus" AS ENUM ('published', 'draft');

CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "author_id" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_repost" BOOLEAN NOT NULL DEFAULT false,
    "original_post_id" TEXT,
    "original_author_id" TEXT,
    "title" TEXT,
    "video_url" TEXT,
    "announcement" TEXT,
    "text" TEXT,
    "quote" TEXT,
    "quote_author" TEXT,
    "image_url" TEXT,
    "url" TEXT,
    "description" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

