import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:opacity-90',
  outline: 'border border-line-input bg-surface text-ink hover:bg-subtle',
  danger: 'border border-danger-line bg-danger-soft text-danger hover:opacity-90',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-ctl px-4 text-[15px] font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

/** Square 44px icon-only button. `label` is required for accessibility. */
export function IconButton({
  label,
  className = '',
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl text-ink transition-colors hover:bg-subtle ${className}`}
      {...rest}
    />
  );
}
