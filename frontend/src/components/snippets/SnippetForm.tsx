import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import {
  type SnippetFormValues,
  snippetSchema,
} from '../../lib/validations/snippet';
import { createSnippet, updateSnippet } from '../../services/snippets';
import type { Snippet } from '../../types/snippet';
import { CategorySelect } from './CategorySelect';
import { FileEditor } from './FileEditor';
import { TagInput } from './TagInput';

interface SnippetFormProps {
  mode: 'create' | 'edit';
  snippetId?: string;
  initialValues?: SnippetFormValues;
}

const defaultValues: SnippetFormValues = {
  title: '',
  description: '',
  thumbnail: '',
  categoryId: '',
  tagIds: [],
  files: [{ language: 'js', content: '', order: 0 }],
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to submit snippet. Please try again.';
};

export const SnippetForm = ({
  mode,
  snippetId,
  initialValues,
}: SnippetFormProps) => {
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags, isLoading: tagsLoading } = useTags();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = methods;

  const selectedCategoryId = useWatch({ control, name: 'categoryId' }) ?? '';
  const selectedTagIds = useWatch({ control, name: 'tagIds' }) ?? [];

  const submitText = mode === 'create' ? 'Create snippet' : 'Update snippet';

  const onSubmit = async (values: SnippetFormValues) => {
    try {
      setSubmitError(null);
      const payload = {
        ...values,
        description: values.description?.trim() || undefined,
        thumbnail: values.thumbnail?.trim() || undefined,
      };

      let result: Snippet;

      if (mode === 'create') {
        result = await createSnippet(payload);
      } else {
        if (!snippetId) {
          throw new Error('Missing snippet id for update');
        }
        result = await updateSnippet(snippetId, payload);
      }

      navigate(`/snippets/${result.id}`);
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            {...register('title')}
            placeholder="Snippet title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.title ? (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Short description"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Thumbnail URL (optional)
          </label>
          <input
            {...register('thumbnail')}
            placeholder="https://..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.thumbnail ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.thumbnail.message}
            </p>
          ) : null}
        </div>

        <CategorySelect
          categories={categories}
          value={selectedCategoryId}
          onChange={(value) =>
            setValue('categoryId', value, {
              shouldTouch: true,
              shouldValidate: true,
            })
          }
          error={errors.categoryId?.message}
        />

        {categoriesLoading ? (
          <p className="text-sm text-slate-500">Loading categories...</p>
        ) : null}

        {tagsLoading ? (
          <p className="text-sm text-slate-500">Loading tags...</p>
        ) : (
          <TagInput
            tags={tags}
            selectedTagIds={selectedTagIds}
            onChange={(tagIds) =>
              setValue('tagIds', tagIds, {
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        )}

        <FileEditor />

        {submitError ? (
          <p className="text-sm text-red-600">{submitError}</p>
        ) : null}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
