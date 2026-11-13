import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { business } from './site';

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
      // Defaults to the business itself. Put a person's name here only when a
      // real person wrote or reviewed the post and has agreed to be named.
      author: z.string().default(business.businessName),
      authorUrl: z.string().optional(), // that person's bio page, e.g. "/about/jane-doe/"
      // Shown as "Reviewed by ..." when set. Only for a review that really happened.
      reviewedBy: z.string().optional(),
      // Optional. Used for the post's card image, share image and hero. A local
      // file next to the post. Leave it out rather than inventing a picture.
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      // Short list of related service/town names - powers internal linking suggestions.
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }).refine((post) => !post.coverImage || Boolean(post.coverImageAlt), {
      message: 'coverImageAlt is required when coverImage is set',
      path: ['coverImageAlt'],
    }),
});

export const collections = { blog };
