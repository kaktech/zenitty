import type { Task } from './api';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayDiff = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Built by hand: Intl's en-GB abbreviates September as "Sept", but the design uses "Sep".
const formatDayMonth = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export const formatDay = (iso: string) => {
  const d = new Date(iso);
  return `${formatDayMonth(d)} ${d.getFullYear()}`;
};

export const formatDateTime = (iso: string) => `${formatDay(iso)}, ${formatTime(iso)}`;

export const formatHeaderDate = (short = false) => {
  const d = new Date();
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = short ? MONTHS[d.getMonth()] : d.toLocaleDateString('en-GB', { month: 'long' });
  return `${weekday}, ${d.getDate()} ${month}`;
};

export const isOverdue = (t: Task) =>
  t.status !== 'COMPLETED' && !!t.dueDate && dayDiff(new Date(t.dueDate), new Date()) < 0;

/** Meta text shown under a task title, e.g. "Today, 9:45 AM" or "Overdue, yesterday". */
export function dueText(t: Task, short = false): string {
  if (t.status === 'COMPLETED' && t.completedAt) {
    return `${short ? 'Done' : 'Completed'} ${formatTime(t.completedAt)}`;
  }
  if (!t.dueDate) return 'No due date';
  const due = new Date(t.dueDate);
  const diff = dayDiff(due, new Date());
  if (diff < 0) return `Overdue, ${diff === -1 ? 'yesterday' : `${-diff} days ago`}`;
  if (diff === 0) return `Today, ${formatTime(t.dueDate)}`;
  if (diff === 1) return `Tomorrow, ${formatTime(t.dueDate)}`;
  return `${formatDayMonth(due)}, ${formatTime(t.dueDate)}`;
}

/** ISO string -> value for <input type="datetime-local"> in local time. */
export function toInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const fromInputValue = (v: string): string | null => (v ? new Date(v).toISOString() : null);

export const defaultDueValue = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return toInputValue(d.toISOString());
};
