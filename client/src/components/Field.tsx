import { useId, type ReactNode } from 'react';

export const inputClass =
  'min-h-[44px] w-full rounded-ctl border border-line-input bg-surface px-3.5 text-[15px] font-bold text-ink placeholder:font-semibold placeholder:text-muted';

interface Props {
  label: string;
  error?: string;
  className?: string;
  children: (id: string) => ReactNode;
}

/** Label + control wrapper. The render prop receives the id to attach to the control. */
export function Field({ label, error, className = '', children }: Props) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-meta-lg text-ink">
        {label}
      </label>
      {children(id)}
      {error && (
        <p role="alert" className="mt-1 text-meta-lg text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
