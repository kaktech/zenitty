import { AlertCircle, ClipboardList } from 'lucide-react';
import { Button } from './Button';

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul aria-busy="true" aria-label="Loading tasks" className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="h-[60px] animate-pulse rounded-row bg-surface md:bg-row" />
      ))}
    </ul>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <ClipboardList size={36} strokeWidth={2} className="text-muted" aria-hidden="true" />
      <p className="text-title text-ink">{title}</p>
      {hint && <p className="text-meta-lg text-muted">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <AlertCircle size={36} strokeWidth={2} className="text-danger" aria-hidden="true" />
      <p className="text-title text-ink">Couldn't load tasks</p>
      <p className="text-meta-lg text-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
