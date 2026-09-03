import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // metaDescription is separate from any on-page intro text - written specifically
      // for search snippets, ~150-160 characters.
      metaDescription: z.string().max(160),
      publishDate: z.date(),
      updatedDate: z.date().optional(),
      author: z.string().default('Team'),
      // Used for the post's card image, og:image, and hero. Local file under src/content/blog/.
      coverImage: image(),
      coverImageAlt: z.string(),
      // Short list of related service/town names - powers internal linking suggestions.
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
