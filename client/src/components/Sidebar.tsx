import { CalendarDays, CheckCircle2, Check, LayoutGrid, List } from 'lucide-react';
import type { View } from '../hooks/useUrlState';

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
}

export function Sidebar({ view, onView, collapsed }: Props) {
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
    </aside>
  );
}
