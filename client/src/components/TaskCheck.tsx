import { Check } from 'lucide-react';

interface Props {
  done: boolean;
  onToggle: () => void;
  title: string;
}

/** 22px circle inside a 44x44 touch target. */
export function TaskCheck({ done, onToggle, title }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={done ? `Mark "${title}" as not done` : `Mark "${title}" as done`}
      onClick={onToggle}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-primary ${
          done ? 'bg-primary text-primary-fg' : ''
        }`}
      >
        {done && <Check size={14} strokeWidth={3} aria-hidden="true" />}
      </span>
    </button>
  );
}
