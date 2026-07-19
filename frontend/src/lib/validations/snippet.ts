import { z } from 'zod';

export const snippetFileSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(1, 'Content is required'),
  order: z.number().min(0),
});

export const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  thumbnail: z
    .union([z.literal(''), z.string().url('Thumbnail must be a valid URL')])
    .optional(),
  categoryId: z.string().uuid('Category is required'),
  tagIds: z.array(z.string().uuid()),
  files: z.array(snippetFileSchema).min(1, 'At least one file is required'),
});

export type SnippetFormValues = z.infer<typeof snippetSchema>;
