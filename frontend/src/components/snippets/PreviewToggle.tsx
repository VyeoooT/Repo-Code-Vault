interface PreviewToggleProps {
  viewportMode: 'mobile' | 'desktop';
  onToggle: (mode: 'mobile' | 'desktop') => void;
}

export const PreviewToggle = ({
  viewportMode,
  onToggle,
}: PreviewToggleProps) => {
  return (
    <div className="flex gap-2 border-b border-slate-200 pb-4">
      <button
        onClick={() => onToggle('mobile')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          viewportMode === 'mobile'
            ? 'border-b-2 border-blue-700 text-blue-700'
            : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        📱 Mobile (375px)
      </button>
      <button
        onClick={() => onToggle('desktop')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          viewportMode === 'desktop'
            ? 'border-b-2 border-blue-700 text-blue-700'
            : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        🖥️ Desktop (100%)
      </button>
    </div>
  );
};
