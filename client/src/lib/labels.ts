import type { Category, Priority } from './api';

export const priorityLabels: Record<Priority, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

// Full class strings so Tailwind can see them.
export const priorityBadgeClass: Record<Priority, string> = {
  HIGH: 'bg-prio-high text-prio-high-fg',
  MEDIUM: 'bg-prio-medium text-prio-medium-fg',
  LOW: 'bg-prio-low text-prio-low-fg',
};

export const prioritySelectedClass: Record<Priority, string> = {
  HIGH: 'border-prio-high-line bg-prio-high text-prio-high-fg',
  MEDIUM: 'border-prio-medium-line bg-prio-medium text-prio-medium-fg',
  LOW: 'border-prio-low-line bg-prio-low text-prio-low-fg',
};

export const categoryDotClass: Record<Category, string> = {
  Work: 'bg-cat-work',
  Personal: 'bg-cat-personal',
  Health: 'bg-cat-health',
  Shopping: 'bg-cat-shopping',
  Other: 'bg-cat-other',
};
