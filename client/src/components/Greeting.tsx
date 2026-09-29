import { formatHeaderDate } from '../lib/format';

export const USER_NAME: string = import.meta.env.VITE_USER_NAME ?? 'Johnny';

export function Avatar() {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stat-today text-[18px] font-extrabold text-stat-today-fg md:h-[52px] md:w-[52px]"
    >
      {USER_NAME.charAt(0).toUpperCase()}
    </span>
  );
}

export function Greeting({ short, subtitle }: { short?: boolean; subtitle?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-meta-lg text-ink-2 max-md:text-meta">
        {formatHeaderDate(short)}
        {subtitle}
      </p>
      <h1 className="truncate text-greeting text-ink lg:text-greeting-lg">Hello, {USER_NAME}</h1>
    </div>
  );
}
