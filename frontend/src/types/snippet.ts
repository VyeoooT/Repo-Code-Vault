import type { Category } from './category';
import type { Tag } from './tag';

export interface SnippetAuthor {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
}

export interface SnippetFile {
  id: string;
  language: string;
  content: string;
  order: number;
}

export interface SnippetTagRelation {
  snippetId: string;
  tagId: string;
  tag: Tag;
}

export interface Snippet {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Category;
  authorId: string;
  author: SnippetAuthor;
  tags: SnippetTagRelation[];
  files: SnippetFile[];
}

export interface SnippetQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export interface SnippetFileInput {
  language: string;
  content: string;
  order: number;
}

export interface UpsertSnippetPayload {
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId: string;
  tagIds: string[];
  files: SnippetFileInput[];
}
