import { ChevronLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { TaskForm } from '../components/TaskForm';
import { useCreateTask } from '../hooks/useTasks';

export function AddTaskPage({ onBack, onCreated }: { onBack: () => void; onCreated: (id: string) => void }) {
  const create = useCreateTask();

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
        <h1 className="text-[18px] font-extrabold text-ink">Add new task</h1>
      </header>

      <div className="flex-1 rounded-card bg-surface p-5">
        <TaskForm
          formId="add-form"
          onSubmit={(input) => create.mutate(input, { onSuccess: (t) => onCreated(t.id) })}
        />
        {create.error && (
          <p role="alert" className="mt-3 text-meta-lg text-danger">
            {create.error.message}
          </p>
        )}
      </div>

      <Button type="submit" form="add-form" disabled={create.isPending} className="sticky bottom-5 h-[54px] w-full">
        {create.isPending ? 'Creating…' : 'Create task'}
      </Button>
    </div>
  );
}
