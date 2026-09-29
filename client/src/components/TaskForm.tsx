import { useState, type FormEvent } from 'react';
import { STATUSES, type Status, type Task, type TaskInput } from '../lib/api';
import { defaultDueValue, fromInputValue, toInputValue } from '../lib/format';
import { Field, inputClass } from './Field';

export const statusLabels: Record<Status, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

interface Props {
  /** Existing task to edit; omit to create. */
  task?: Task;
  formId: string;
  onSubmit: (input: TaskInput) => void;
}

export function TaskForm({ task, formId, onSubmit }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<Status>(task?.status ?? 'TODO');
  const [due, setDue] = useState(task ? toInputValue(task.dueDate) : defaultDueValue());
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task name is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      dueDate: fromInputValue(due),
    });
  };

  return (
    <form id={formId} onSubmit={submit} noValidate className="space-y-4">
      <Field label="Task name" error={error}>
        {(id) => (
          <input
            id={id}
            className={inputClass}
            value={title}
            maxLength={200}
            placeholder="What do you need to do?"
            aria-invalid={!!error}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
          />
        )}
      </Field>
      <Field label={task ? 'Description' : 'Description (optional)'}>
        {(id) => (
          <textarea
            id={id}
            rows={3}
            className={`${inputClass} resize-none py-2.5 font-semibold`}
            value={description}
            maxLength={2000}
            placeholder="Add details"
            onChange={(e) => setDescription(e.target.value)}
          />
        )}
      </Field>
      {task && (
        <Field label="Status">
          {(id) => (
            <select
              id={id}
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}
      <Field label="Due date">
        {(id) => (
          <input
            id={id}
            type="datetime-local"
            className={inputClass}
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        )}
      </Field>
    </form>
  );
}
