import { useFieldArray, useFormContext } from 'react-hook-form';

import type { SnippetFormValues } from '../../lib/validations/snippet';

const languageOptions = ['html', 'css', 'js', 'ts', 'tsx', 'php'];

export const FileEditor = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<SnippetFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Code files</h3>
        <button
          type="button"
          onClick={() =>
            append({
              language: 'js',
              content: '',
              order: fields.length,
            })
          }
          className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
        >
          Add file
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">File #{index + 1}</p>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          <div className="mb-2">
            <select
              {...register(`files.${index}.language`)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <textarea
            {...register(`files.${index}.content`)}
            rows={6}
            placeholder="Paste code here..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
          />

          <input
            type="hidden"
            {...register(`files.${index}.order`, { valueAsNumber: true })}
            value={index}
          />

          {errors.files?.[index]?.content ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.files[index]?.content?.message}
            </p>
          ) : null}
        </div>
      ))}

      {errors.files?.message ? (
        <p className="text-sm text-red-600">{errors.files.message}</p>
      ) : null}
    </div>
  );
};
