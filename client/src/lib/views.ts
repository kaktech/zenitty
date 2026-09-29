import type { TaskQuery } from './api';
import type { Stat, View } from '../hooks/useUrlState';
import type { Filters } from './filters';

export const viewTitle: Record<View, string> = {
  dashboard: "Today's tasks",
  all: 'All tasks',
  today: 'Due today',
  completed: 'Completed',
};

export const statTitle: Record<Stat, string> = {
  today: 'Due today',
  overdue: 'Overdue',
  all: 'All tasks',
  done: 'Completed this week',
};

/** A selected stat card overrides the sidebar view. */
export function listQuery(view: View, stat: Stat | null): TaskQuery {
  if (stat === 'today') return { due: 'today' };
  if (stat === 'overdue') return { due: 'overdue' };
  if (stat === 'done') return { completed: 'week' };
  if (stat === 'all') return {};
  return viewQuery(view);
}

export function viewQuery(view: View): TaskQuery {
  switch (view) {
    case 'dashboard':
      return { due: 'todayAndOverdue' };
    case 'today':
      return { due: 'today' };
    case 'completed':
      return { status: 'COMPLETED' };
    default:
      return {};
  }
}

/** Sidebar view / stat card plus the search, filter and sort controls. */
export function fullQuery(view: View, stat: Stat | null, f: Filters): TaskQuery {
  let base = listQuery(view, stat);
  // Searching from the default dashboard should look across every task, not just today's.
  if (f.q && view === 'dashboard' && !stat) base = {};
  return {
    ...base,
    search: f.q || undefined,
    status: f.status ?? base.status,
    priority: f.priority,
    category: f.category,
    sort: f.sort,
  };
}
