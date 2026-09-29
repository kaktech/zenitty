import { PRIORITIES, type Priority } from '../lib/api';
import { priorityLabels, prioritySelectedClass } from '../lib/labels';

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
  labelledBy: string;
}

/** 3-button segmented control; the selected option uses its badge colors with a darker border. */
export function PriorityControl({ value, onChange, labelledBy }: Props) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-3 gap-2">
      {PRIORITIES.map((p) => {
        const selected = p === value;
        return (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(p)}
            className={`min-h-[44px] rounded-ctl border-2 text-[14px] font-extrabold ${
              selected ? prioritySelectedClass[p] : 'border-line-input bg-surface text-ink hover:bg-subtle'
            }`}
          >
            {priorityLabels[p]}
          </button>
        );
      })}
    </div>
  );
}
