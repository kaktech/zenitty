import { CATEGORIES, type Category } from '../lib/api';

interface Props {
  value: Category;
  onChange: (c: Category) => void;
  labelledBy: string;
}

export function CategoryPills({ value, onChange, labelledBy }: Props) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const selected = c === value;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(c)}
            className={`min-h-[44px] rounded-full border px-4 text-[14px] font-extrabold ${
              selected
                ? 'border-primary bg-primary text-primary-fg'
                : 'border-line-input bg-surface text-ink hover:bg-subtle'
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
