import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="fixed z-20 h-auto w-full border-b border-slate-100 bg-white py-3.5 shadow-sm shadow-slate-700/3">
      <div className="mx-auto flex h-auto max-w-[75rem] items-center justify-between px-2">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Repo Code Vault
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link to="/" className="transition-colors hover:text-slate-900">
            Snippets
          </Link>
          <Link
            to="/snippets/new"
            className="rounded-md bg-slate-900 px-3 py-2 font-medium text-white transition-colors duration-300 hover:bg-stone-700"
          >
            New Snippet
          </Link>
        </nav>
      </div>
    </header>
  );
};
