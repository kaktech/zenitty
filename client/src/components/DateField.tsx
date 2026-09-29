import { Calendar } from 'lucide-react';
import { formatDateTime } from '../lib/format';

interface Props {
  id: string;
  /** Value for datetime-local ("YYYY-MM-DDTHH:mm"), or empty. */
  value: string;
  onChange: (v: string) => void;
  icon?: boolean;
}

/**
 * Shows the date as "29 Sep 2026, 9:45 AM" (like the mockups) while a transparent native
 * datetime-local input sits on top, so the OS picker, keyboard entry and labels all still work.
 */
export function DateField({ id, value, onChange, icon }: Props) {
  return (
    <div className="relative flex min-h-[44px] items-center rounded-ctl border border-line-input bg-surface px-3.5 text-[15px] font-bold text-ink focus-within:ring-2 focus-within:ring-primary">
      {icon && <Calendar size={18} strokeWidth={2} aria-hidden="true" className="mr-2.5 shrink-0 text-muted" />}
      <span aria-hidden="true" className={value ? '' : 'font-semibold text-muted'}>
        {value ? formatDateTime(new Date(value).toISOString()) : 'Set due date'}
      </span>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker();
          } catch {
            /* unsupported: the native control still works */
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
