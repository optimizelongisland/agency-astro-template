import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'Optimize Long Island Blog',
    description: 'Notes on websites and local search from Optimize Long Island.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.metaDescription,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
