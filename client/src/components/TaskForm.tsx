import { useId, useState, type FormEvent } from 'react';
import {
  CATEGORIES,
  STATUSES,
  type Category,
  type Priority,
  type Status,
  type Task,
  type TaskInput,
} from '../lib/api';
import { defaultDueValue, fromInputValue, toInputValue } from '../lib/format';
import { CategoryPills } from './CategoryPills';
import { DateField } from './DateField';
import { Field, inputClass } from './Field';
import { PriorityControl } from './PriorityControl';

export const statusLabels: Record<Status, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

interface Props {
  /** Existing task to edit; omit to create. */
  task?: Task;
  formId: string;
  /** `panel` = laptop/tablet side panel (category select), `page` = mobile full page (category pills). */
  layout?: 'panel' | 'page';
  onSubmit: (input: TaskInput) => void;
}

export function TaskForm({ task, formId, layout = 'panel', onSubmit }: Props) {
  const priorityLabelId = useId();
  const categoryLabelId = useId();
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<Status>(task?.status ?? 'TODO');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MEDIUM');
  const [category, setCategory] = useState<Category>(task?.category ?? 'Work');
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
      priority,
      category,
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
      {layout === 'panel' ? (
        <div className="grid grid-cols-2 gap-3">
          {task ? <StatusField value={status} onChange={setStatus} /> : <div className="hidden" />}
          <Field label="Category" className={task ? '' : 'col-span-2'}>
            {(id) => (
              <select
                id={id}
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      ) : (
        task && <StatusField value={status} onChange={setStatus} />
      )}

      <div>
        <p id={priorityLabelId} className="mb-1.5 block text-meta-lg text-ink">
          Priority
        </p>
        <PriorityControl value={priority} onChange={setPriority} labelledBy={priorityLabelId} />
      </div>

      {layout === 'page' && (
        <div>
          <p id={categoryLabelId} className="mb-1.5 block text-meta-lg text-ink">
            Category
          </p>
          <CategoryPills value={category} onChange={setCategory} labelledBy={categoryLabelId} />
        </div>
      )}

      <Field label="Due date">
        {(id) => <DateField id={id} value={due} onChange={setDue} icon={layout === 'page'} />}
      </Field>
    </form>
  );
}

function StatusField({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <Field label="Status">
      {(id) => (
        <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value as Status)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
