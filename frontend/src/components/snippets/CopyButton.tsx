import { useEffect, useState } from 'react';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

interface CopyButtonProps {
  onCopy: () => Promise<boolean>;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  resetMs?: number;
  className?: string;
}

export const CopyButton = ({
  onCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  errorLabel = 'Copy failed',
  resetMs = 1500,
  className = '',
}: CopyButtonProps) => {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state !== 'copied' && state !== 'error') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setState('idle');
    }, resetMs);

    return () => window.clearTimeout(timeout);
  }, [resetMs, state]);

  const handleClick = async () => {
    setState('copying');
    const ok = await onCopy();
    setState(ok ? 'copied' : 'error');
  };

  const buttonLabel =
    state === 'copied'
      ? copiedLabel
      : state === 'copying'
        ? 'Copying...'
        : state === 'error'
          ? errorLabel
          : label;

  const stateClass =
    state === 'copied'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
      : state === 'error'
        ? 'border-red-300 bg-red-50 text-red-700'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'copying'}
      className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${stateClass} ${className}`}
    >
      {buttonLabel}
    </button>
  );
};
