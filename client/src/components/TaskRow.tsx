import type { Task } from '../lib/api';
import { dueText, isOverdue } from '../lib/format';
import { PriorityBadge } from './Badges';
import { TaskCheck } from './TaskCheck';

interface Props {
  task: Task;
  selected: boolean;
  short?: boolean;
  onOpen: () => void;
  onToggle: () => void;
}

export function TaskRow({ task, selected, short, onOpen, onToggle }: Props) {
  const done = task.status === 'COMPLETED';
  const overdue = isOverdue(task);

  return (
    <li
      className={`flex items-center gap-1 rounded-row border-2 bg-surface pl-2 pr-3 transition-colors md:bg-row ${
        selected ? 'border-primary' : 'border-transparent md:hover:border-line-input'
      }`}
    >
      <TaskCheck done={done} onToggle={onToggle} title={task.title} />
      <button
        type="button"
        onClick={onOpen}
        aria-current={selected ? 'true' : undefined}
        className="flex min-h-[56px] min-w-0 flex-1 flex-col justify-center rounded-ctl py-2 text-left"
      >
        <span className={`truncate text-title ${done ? 'text-muted line-through' : 'text-ink'}`}>
          {task.title}
        </span>
        <span className={`truncate text-meta md:text-meta-lg ${overdue ? 'text-danger' : 'text-muted'}`}>
          {task.category} · {dueText(task, short)}
        </span>
      </button>
      <PriorityBadge priority={task.priority} />
    </li>
  );
}
