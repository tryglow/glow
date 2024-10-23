'use server';

import { ArticleMetadata } from '@/types/mdx';
import { readdir } from 'fs/promises';
import path from 'path';

type Article = {
  slug: string;
} & ArticleMetadata;

export async function getArticles(): Promise<Article[]> {
  const slugs = (
    await readdir(path.join(process.cwd(), './app/i/blog/(posts)'), {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isDirectory());

  const articles = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(`./(posts)/${name}/page.mdx`);
      return { slug: name, ...metadata };
    })
  );

  articles.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return articles;
}

export async function getArticlesBySlug(slugs: string[]): Promise<Article[]> {
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(`./(posts)/${slug}/page.mdx`);
      return { slug, ...metadata };
    })
  );

  return articles;
}
