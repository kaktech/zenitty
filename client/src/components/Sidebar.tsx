import { CalendarDays, CheckCircle2, Check, LayoutGrid, List } from 'lucide-react';
import { useCategoryCounts } from '../hooks/useStats';
import type { View } from '../hooks/useUrlState';
import { CATEGORIES, type Category } from '../lib/api';
import { CategoryDot } from './Badges';

const items: { view: View; label: string; Icon: typeof List }[] = [
  { view: 'dashboard', label: 'Dashboard', Icon: LayoutGrid },
  { view: 'all', label: 'All tasks', Icon: List },
  { view: 'today', label: 'Today', Icon: CalendarDays },
  { view: 'completed', label: 'Completed', Icon: CheckCircle2 },
];

interface Props {
  view: View;
  onView: (v: View) => void;
  /** Icon-only (tablet). */
  collapsed: boolean;
  category?: Category;
  onCategory: (c: Category | null) => void;
}

export function Sidebar({ view, onView, collapsed, category, onCategory }: Props) {
  const { data: counts } = useCategoryCounts();

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col gap-6 overflow-y-auto border-r border-line bg-surface p-5 ${
        collapsed ? 'w-[76px] items-center px-3' : 'w-[248px]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-ctl bg-primary text-primary-fg">
          <Check size={20} strokeWidth={3} aria-hidden="true" />
        </span>
        {!collapsed && <span className="text-[22px] font-black text-ink">Zenitty</span>}
      </div>

      <nav aria-label="Main" className="flex flex-col gap-1.5">
        {items.map(({ view: v, label, Icon }) => {
          const active = v === view;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onView(v)}
              aria-current={active ? 'page' : undefined}
              aria-label={collapsed ? label : undefined}
              title={collapsed ? label : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-ctl text-[15px] font-extrabold ${
                collapsed ? 'w-11 justify-center' : 'px-3'
              } ${active ? 'bg-primary text-primary-fg' : 'text-ink hover:bg-subtle'}`}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <section aria-labelledby="categories-label">
          <h2 id="categories-label" className="mb-2 px-3 text-label uppercase text-muted">
            Categories
          </h2>
          <ul className="flex flex-col">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => onCategory(category === c ? null : c)}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-ctl px-3 text-left text-[15px] font-bold text-ink hover:bg-subtle ${
                    category === c ? 'bg-subtle' : ''
                  }`}
                >
                  <CategoryDot category={c} size={10} />
                  <span className="flex-1">{c}</span>
                  <span className="text-meta-lg text-muted">{counts?.[c] ?? ''}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
