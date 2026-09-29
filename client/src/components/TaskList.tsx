import type { Task, TaskQuery } from '../lib/api';
import { useTasks, useUpdateTask } from '../hooks/useTasks';
import { EmptyState, ErrorState, ListSkeleton } from './States';
import { TaskRow } from './TaskRow';

interface Props {
  query: TaskQuery;
  selectedId: string | null;
  short?: boolean;
  onOpen: (id: string) => void;
}

export function TaskList({ query, selectedId, short, onOpen }: Props) {
  const { data, isPending, isError, error, refetch } = useTasks(query);
  const update = useUpdateTask();

  if (isPending) return <ListSkeleton />;
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (data.length === 0) {
    return <EmptyState title="No tasks here" hint="Add a task to get started." />;
  }

  const toggle = (t: Task) =>
    update.mutate({ id: t.id, patch: { status: t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' } });

  return (
    <ul className="space-y-2">
      {data.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          selected={t.id === selectedId}
          short={short}
          onOpen={() => onOpen(t.id)}
          onToggle={() => toggle(t)}
        />
      ))}
    </ul>
  );
}
