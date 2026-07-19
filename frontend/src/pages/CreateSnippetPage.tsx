import { Link } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';
import { SnippetForm } from '../components/snippets/SnippetForm';
import { useAuth } from '../hooks/useAuth';

export default function CreateSnippetPage() {
  const { user, loading } = useAuth();

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
          Please login before creating snippets. Go to{' '}
          <Link to="/testauth" className="font-medium underline">
            TestAuth
          </Link>{' '}
          to sign in.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">
        Create snippet
      </h1>
      <SnippetForm mode="create" />
    </Layout>
  );
}
