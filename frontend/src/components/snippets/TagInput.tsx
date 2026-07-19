import type { Tag } from '../../types/tag';

interface TagInputProps {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export const TagInput = ({ tags, selectedTagIds, onChange }: TagInputProps) => {
  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
      return;
    }

    onChange([...selectedTagIds, tagId]);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTagIds.includes(tag.id);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                active
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              #{tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
