import { ChevronDown, Filter as FilterIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status } from '../lib/api';
import { sortLabels, type Filters, type Sort } from '../lib/filters';
import { priorityLabels } from '../lib/labels';
import { Button } from './Button';
import { Chip } from './Chip';
import { inputClass } from './Field';
import { statusLabels } from './TaskForm';

interface Handlers {
  filters: Filters;
  onChange: (key: 'status' | 'priority' | 'category' | 'sort', value: string | null) => void;
}

export function StatusChips({ filters, onChange }: Handlers) {
  return (
    <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
      <Chip selected={!filters.status} onClick={() => onChange('status', null)}>
        All
      </Chip>
      {STATUSES.map((s: Status) => (
        <Chip key={s} selected={filters.status === s} onClick={() => onChange('status', s)}>
          {statusLabels[s]}
        </Chip>
      ))}
    </div>
  );
}

export function SortSelect({ filters, onChange, className = '' }: Handlers & { className?: string }) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Sort tasks by
      </label>
      <select
        id={id}
        value={filters.sort}
        onChange={(e) => onChange('sort', e.target.value)}
        className={`${inputClass} appearance-none pr-9 lg:min-h-[38px] lg:w-auto lg:rounded-ctl lg:py-0 lg:pl-3 lg:text-[13px]`}
      >
        {(Object.keys(sortLabels) as Sort[]).map((s) => (
          <option key={s} value={s}>
            Sort: {sortLabels[s]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
      />
    </div>
  );
}

/** Priority + category chips shared by the laptop popover and the mobile sheet. */
export function FilterFields({ filters, onChange }: Handlers) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-label uppercase text-muted">Priority</legend>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p: Priority) => (
            <Chip
              key={p}
              selected={filters.priority === p}
              onClick={() => onChange('priority', filters.priority === p ? null : p)}
            >
              {priorityLabels[p]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-label uppercase text-muted">Category</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c: Category) => (
            <Chip
              key={c}
              selected={filters.category === c}
              onClick={() => onChange('category', filters.category === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/** Laptop/tablet "Filter" button with a popover. */
export function FilterPopover({ filters, onChange, onClear }: Handlers & { onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = Number(!!filters.priority) + Number(!!filters.category);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="lg:min-h-[38px] lg:px-3 lg:text-[13px]"
      >
        <FilterIcon size={16} strokeWidth={2} aria-hidden="true" />
        Filter{active > 0 && ` (${active})`}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-[320px] max-w-[85vw] rounded-card border border-line bg-surface p-4">
          <FilterFields filters={filters} onChange={onChange} />
          <Button variant="outline" className="mt-4 w-full" onClick={onClear}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
