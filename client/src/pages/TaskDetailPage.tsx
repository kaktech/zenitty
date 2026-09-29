import { Check, ChevronLeft, Pencil } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button, IconButton } from '../components/Button';
import { CategoryDot, PriorityBadge } from '../components/Badges';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { inputClass } from '../components/Field';
import { ErrorState, ListSkeleton } from '../components/States';
import { statusLabels, TaskForm } from '../components/TaskForm';
import { useDeleteTask, useTask, useUpdateTask } from '../hooks/useTasks';
import { STATUSES, type Status } from '../lib/api';
import { dueText, formatDateTime, formatDay } from '../lib/format';

export function TaskDetailPage({ id, onBack }: { id: string; onBack: () => void }) {
  const { data: task, isPending, isError, error, refetch } = useTask(id);
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const done = task?.status === 'COMPLETED';

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-page p-5">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-fg"
        >
          <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <h1 className="flex-1 text-[18px] font-extrabold text-ink">{editing ? 'Edit task' : 'Task detail'}</h1>
        {task && !editing && (
          <IconButton label="Edit task" onClick={() => setEditing(true)} className="bg-surface">
            <Pencil size={18} strokeWidth={2} aria-hidden="true" />
          </IconButton>
        )}
      </header>

      {isPending && <ListSkeleton rows={3} />}
      {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

      {task && editing && (
        <>
          <div className="flex-1 rounded-card bg-surface p-5">
            <TaskForm
              key={task.updatedAt}
              formId="edit-form"
              layout="page"
              task={task}
              onSubmit={(input) => update.mutate({ id: task.id, patch: input }, { onSuccess: () => setEditing(false) })}
            />
            {update.error && (
              <p role="alert" className="mt-3 text-meta-lg text-danger">
                {update.error.message}
              </p>
            )}
          </div>
          <Button type="submit" form="edit-form" disabled={update.isPending} className="h-[54px] w-full">
            {update.isPending ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)} className="h-[54px] w-full">
            Cancel
          </Button>
        </>
      )}

      {task && !editing && (
        <>
          <section className="rounded-card bg-stat-today p-5">
            <p className="text-meta-lg text-stat-today-fg">
              {task.category} · Due {task.dueDate ? dueText({ ...task, status: 'TODO' }).toLowerCase() : 'never'}
            </p>
            <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight text-ink">{task.title}</h2>
            {task.description && <p className="mt-2 text-[14px] font-semibold text-ink-2">{task.description}</p>}
          </section>

          <dl className="rounded-card bg-surface px-5">
            <Row label="Status">
              <select
                aria-label="Status"
                className={`${inputClass} w-auto`}
                value={task.status}
                onChange={(e) => update.mutate({ id: task.id, patch: { status: e.target.value as Status } })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </Row>
            <Row label="Priority">
              <PriorityBadge priority={task.priority} />
            </Row>
            <Row label="Category">
              <span className="flex items-center gap-2 text-[14px] font-extrabold text-ink">
                <CategoryDot category={task.category} />
                {task.category}
              </span>
            </Row>
            <Row label="Due date">
              <span className="text-[14px] font-extrabold text-ink">
                {task.dueDate ? formatDateTime(task.dueDate) : 'None'}
              </span>
            </Row>
            <Row label="Created" last>
              <span className="text-[14px] font-bold text-muted">{formatDay(task.createdAt)}</span>
            </Row>
          </dl>

          <div className="mt-auto flex flex-col gap-3">
            <Button
              className="h-[54px] w-full"
              disabled={update.isPending}
              onClick={() => update.mutate({ id: task.id, patch: { status: done ? 'TODO' : 'COMPLETED' } })}
            >
              <Check size={18} strokeWidth={2.5} aria-hidden="true" />
              {done ? 'Mark as not done' : 'Mark as complete'}
            </Button>
            <Button variant="danger" className="h-[54px] w-full" onClick={() => setConfirming(true)}>
              Delete task
            </Button>
          </div>
        </>
      )}

      {confirming && task && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${task.title}" will be permanently removed.`}
          confirmLabel="Delete"
          busy={remove.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={() => remove.mutate(task.id, { onSuccess: onBack, onSettled: () => setConfirming(false) })}
        />
      )}
    </div>
  );
}

function Row({ label, children, last }: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={`flex min-h-[60px] items-center justify-between gap-3 ${last ? '' : 'border-b border-line'}`}>
      <dt className="text-[14px] font-bold text-ink-2">{label}</dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}
