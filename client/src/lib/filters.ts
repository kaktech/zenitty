import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status, type TaskQuery } from './api';

export type Sort = NonNullable<TaskQuery['sort']>;

export interface Filters {
  q: string;
  status?: Status;
  priority?: Priority;
  category?: Category;
  sort: Sort;
}

export const sortLabels: Record<Sort, string> = {
  dueDate: 'Due date',
  priority: 'Priority',
  createdAt: 'Newest',
};

const pick = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  allowed.includes(value as T) ? (value as T) : undefined;

/** Read filter state from the URL, ignoring invalid values. */
export function parseFilters(params: URLSearchParams): Filters {
  return {
    q: params.get('q') ?? '',
    status: pick(params.get('status'), STATUSES),
    priority: pick(params.get('priority'), PRIORITIES),
    category: pick(params.get('category'), CATEGORIES),
    sort: pick(params.get('sort'), ['dueDate', 'priority', 'createdAt'] as const) ?? 'dueDate',
  };
}

export const FILTER_KEYS = ['q', 'status', 'priority', 'category', 'sort'] as const;

export const hasActiveFilters = (f: Filters) => !!(f.q || f.status || f.priority || f.category);
