import type { Category } from '../../types/category';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
}

export const CategorySelect = ({
  categories,
  value,
  onChange,
  error,
}: CategorySelectProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">Category</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};
