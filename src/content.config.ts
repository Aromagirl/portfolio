import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { expertiseTags, industryTags } from './data/work-tags';

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  sourceUrl: z.string().url().optional(),
  status: z.enum(['published', 'archived', 'draft']),
  featured: z.boolean(),
  sortOrder: z.number(),
  category: z.string(),
  cover: z.string().nullable(),
  homeProjects: z.array(z.object({ projectId: z.string(), summary: z.string().optional() })).default([]),
});

const tagList = (tags: readonly { id: string }[]) => z.array(
  z.string().refine(value => tags.some(tag => tag.id === value), 'Unknown work tag; use src/data/work-tags.ts'),
).refine(values => new Set(values).size === values.length, 'Duplicate work tags');

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().default(''),
  cover: z.string().nullable().default(null),
  logo: z.string().nullable().default(null),
  companyId: z.string().nullable().optional(),
  role: z.string().default(''),
  expertise: tagList(expertiseTags).default([]),
  industries: tagList(industryTags).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  status: z.enum(['placeholder', 'in-progress', 'published']).default('placeholder'),
  visibility: z.enum(['public', 'hidden']).default('public'),
  cardDisabled: z.boolean().default(false),
  sourceUrl: z.string().url().optional(),
  // Preserve a project's existing top-level URL.
  casePage: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  fillCover: z.boolean().default(false),
});

const workSectionSchema = z.object({
  status: z.enum(['draft', 'published']).default('published'),
  comparison: z.boolean().default(false),
  project: reference('projects'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string(),
  expertise: tagList(expertiseTags).optional(),
  industries: tagList(industryTags).optional(),
  visibility: z.enum(['public', 'hidden']).default('public'),
  cardDisabled: z.boolean().default(false),
  cover: z.string().nullable().default(null),
  fillCover: z.boolean().default(false),
  order: z.number().default(100),
  sourceHeading: z.string().optional(),
  legacyAnchors: z.array(z.string()).default([]),
});

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/companies' }),
    schema: projectSchema,
  }),
  workSections: defineCollection({
    loader: glob({
      pattern: '*/projects/*/*.{md,mdx}',
      base: './src/content/companies',
      // Keep existing section IDs, including anchor aliases, after moving files.
      generateId: ({ entry }) => {
        const [company, , project] = entry.split('/');
        return `${company}-${project}`;
      },
    }),
    schema: workSectionSchema,
  }),
  pages: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }), schema }),
};
