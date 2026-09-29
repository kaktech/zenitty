import { Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useCreateTask, useDeleteTask, useTask, useUpdateTask } from '../hooks/useTasks';
import { dueText } from '../lib/format';
import { Button, IconButton } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorState, ListSkeleton } from './States';
import { useToast } from './Toast';
import { TaskForm } from './TaskForm';

interface Props {
  /** A task id, or "new" for the create form. */
  taskId: string;
  onClose: () => void;
  onSaved: (id: string) => void;
}

/** Laptop side panel / tablet modal body. */
export function DetailPanel({ taskId, onClose, onSaved }: Props) {
  const isNew = taskId === 'new';
  const { data: task, isPending, isError, error, refetch } = useTask(isNew ? null : taskId);
  const create = useCreateTask();
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const [confirming, setConfirming] = useState(false);
  const toast = useToast();

  const saving = create.isPending || update.isPending;
  const failure = create.error ?? update.error ?? remove.error;

  let body;
  if (!isNew && isPending) body = <ListSkeleton rows={3} />;
  else if (!isNew && isError) body = <ErrorState message={error.message} onRetry={() => refetch()} />;
  else {
    body = (
      <TaskForm
        key={taskId + (task?.updatedAt ?? '')}
        formId="detail-form"
        task={isNew ? undefined : task}
        onSubmit={(input) => {
          if (isNew) {
            create.mutate(input, {
              onSuccess: (t) => {
                toast(`Task created · ${dueText(t)}`);
                onSaved(t.id);
              },
            });
          } else {
            update.mutate({ id: taskId, patch: input }, { onSuccess: () => toast('Changes saved') });
          }
        }}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold text-ink">{isNew ? 'New task' : 'Task detail'}</h2>
        <IconButton label="Close task detail" onClick={onClose} className="bg-subtle">
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </IconButton>
      </div>

      <div className="flex-1">{body}</div>

      {failure && (
        <p role="alert" className="mt-3 text-meta-lg text-danger">
          {failure.message}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="submit" form="detail-form" className="flex-1" disabled={saving || (!isNew && !task)}>
          {saving ? 'Saving…' : isNew ? 'Create task' : 'Save changes'}
        </Button>
        {!isNew && (
          <Button
            variant="danger"
            aria-label="Delete task"
            title="Delete task"
            className="w-11 px-0"
            disabled={!task}
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={18} strokeWidth={2} aria-hidden="true" />
          </Button>
        )}
      </div>

      {confirming && task && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${task.title}" will be permanently removed.`}
          confirmLabel="Delete"
          busy={remove.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={() =>
            remove.mutate(task.id, {
              onSuccess: () => {
                toast('Task deleted');
                onClose();
              },
              onSettled: () => setConfirming(false),
            })
          }
        />
      )}
    </div>
  );
}
