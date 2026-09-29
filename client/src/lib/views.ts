import type { TaskQuery } from './api';
import type { Stat, View } from '../hooks/useUrlState';

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
