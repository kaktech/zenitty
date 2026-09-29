import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

export function Chip({ selected, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`min-h-[44px] rounded-full border px-4 text-[14px] font-extrabold lg:min-h-[38px] ${
        selected
          ? 'border-primary bg-primary text-primary-fg'
          : 'border-line-input bg-surface text-ink hover:bg-subtle'
      } ${className}`}
      {...rest}
    />
  );
}
