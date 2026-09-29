import { useStats } from '../hooks/useStats';
import type { Stat } from '../hooks/useUrlState';

const cards: {
  stat: Stat;
  label: string;
  short: string;
  key: 'today' | 'overdue' | 'all' | 'completedThisWeek';
  className: string;
}[] = [
  { stat: 'today', label: 'Due today', short: 'Due today', key: 'today', className: 'bg-stat-today text-stat-today-fg' },
  { stat: 'overdue', label: 'Overdue', short: 'Overdue', key: 'overdue', className: 'bg-stat-overdue text-stat-overdue-fg' },
  { stat: 'all', label: 'All tasks', short: 'All tasks', key: 'all', className: 'bg-stat-all text-stat-all-fg' },
  {
    stat: 'done',
    label: 'Completed this week',
    short: 'Done this week',
    key: 'completedThisWeek',
    className: 'bg-stat-done text-stat-done-fg',
  },
];

interface Props {
  active: Stat | null;
  onSelect: (s: Stat | null) => void;
}

/** Clicking a card filters the task list; clicking the active card clears the filter. */
export function StatCards({ active, onSelect }: Props) {
  const { data, isError } = useStats();

  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => {
        const selected = active === c.stat;
        return (
          <li key={c.stat} className="min-w-0">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? null : c.stat)}
              className={`flex h-[118px] w-full flex-col justify-between rounded-card border-2 p-4 text-left min-w-0 transition-transform hover:-translate-y-0.5 lg:h-[150px] lg:p-5 ${c.className} ${
                selected ? 'border-primary' : 'border-transparent'
              }`}
            >
              <span className="whitespace-normal text-[14px] font-extrabold leading-tight">
                <span className="lg:hidden">{c.short}</span>
                <span className="max-lg:hidden">{c.label}</span>
              </span>
              <span className="text-stat text-ink lg:text-stat-lg">
                {data ? data[c.key] : isError ? '–' : <span className="inline-block h-[0.8em] w-[1.2em] animate-pulse rounded-ctl bg-current opacity-20" />}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
