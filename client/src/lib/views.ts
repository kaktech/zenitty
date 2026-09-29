import type { TaskQuery } from './api';
import type { View } from '../hooks/useUrlState';

export const viewTitle: Record<View, string> = {
  dashboard: "Today's tasks",
  all: 'All tasks',
  today: 'Due today',
  completed: 'Completed',
};

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
