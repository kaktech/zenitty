import { Search } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { inputClass } from './Field';

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

/** Local state for snappy typing; the URL is updated after a short pause. */
export function SearchInput({ value, onChange, className = '' }: Props) {
  const id = useId();
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (text === value) return;
    const t = setTimeout(() => onChange(text), 250);
    return () => clearTimeout(t);
  }, [text, value, onChange]);

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search tasks
      </label>
      <Search
        size={18}
        strokeWidth={2}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search tasks"
        className={`${inputClass} h-[46px] rounded-ctl pl-10`}
      />
    </div>
  );
}
