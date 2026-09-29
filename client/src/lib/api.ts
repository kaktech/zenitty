export const STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const CATEGORIES = ['Work', 'Personal', 'Health', 'Shopping', 'Other'] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Category = (typeof CATEGORIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  category?: Category;
  dueDate?: string | null;
}

export interface TaskQuery {
  search?: string;
  status?: Status;
  priority?: Priority;
  category?: Category;
  sort?: 'dueDate' | 'priority' | 'createdAt';
  due?: 'today' | 'overdue' | 'todayAndOverdue';
  completed?: 'week';
}

export interface Stats {
  today: number;
  overdue: number;
  all: number;
  completedThisWeek: number;
}

export type CategoryCounts = Record<Category, number>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-TZ-Offset': String(new Date().getTimezoneOffset()),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is it running?', 0);
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(body?.error?.message ?? 'Something went wrong', res.status);
  return body as T;
}

export const api = {
  listTasks(q: TaskQuery = {}) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (v) params.set(k, v);
    const qs = params.toString();
    return request<Task[]>(`/tasks${qs ? `?${qs}` : ''}`);
  },
  getTask: (id: string) => request<Task>(`/tasks/${id}`),
  createTask: (input: TaskInput) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }),
  updateTask: (id: string, patch: Partial<TaskInput>) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  stats: () => request<Stats>('/stats'),
  categoryCounts: () => request<CategoryCounts>('/categories/counts'),
};
