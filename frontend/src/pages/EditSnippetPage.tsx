import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';
import { SnippetForm } from '../components/snippets/SnippetForm';
import { useAuth } from '../hooks/useAuth';
import type { SnippetFormValues } from '../lib/validations/snippet';
import { getSnippetById } from '../services/snippets';

export default function EditSnippetPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [initialValues, setInitialValues] = useState<SnippetFormValues | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) {
      return;
    }

    const fetchSnippet = async () => {
      try {
        setError(null);
        const snippet = await getSnippetById(id);

        setInitialValues({
          title: snippet.title,
          description: snippet.description ?? '',
          thumbnail: snippet.thumbnail ?? '',
          categoryId: snippet.categoryId,
          tagIds: snippet.tags.map((item) => item.tagId),
          files: snippet.files.map((file, index) => ({
            language: file.language,
            content: file.content,
            order: file.order ?? index,
          })),
        });
      } catch {
        setError('Failed to load snippet for editing.');
      }
    };

    void fetchSnippet();
  }, [id, user]);

  if (loading) {
    return (
      <Layout>
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Please login before editing snippets. Go to{' '}
          <Link to="/testauth" className="font-medium underline">
            TestAuth
          </Link>{' '}
          to sign in.
        </div>
      </Layout>
    );
  }

  if (!id) {
    return (
      <Layout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid snippet id.
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </Layout>
    );
  }

  if (!initialValues) {
    return (
      <Layout>
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600">
          Loading snippet data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">
        Edit snippet
      </h1>
      <SnippetForm mode="edit" snippetId={id} initialValues={initialValues} />
    </Layout>
  );
}
