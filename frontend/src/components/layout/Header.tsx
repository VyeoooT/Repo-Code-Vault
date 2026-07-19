import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Repo Code Vault
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900">
            Snippets
          </Link>
          <Link
            to="/snippets/new"
            className="rounded-md bg-slate-900 px-3 py-2 font-medium text-white hover:bg-slate-700"
          >
            New Snippet
          </Link>
        </nav>
      </div>
    </header>
  );
};
