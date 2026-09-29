import type { Category, Priority } from '../lib/api';
import { categoryDotClass, priorityBadgeClass, priorityLabels } from '../lib/labels';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[12px] font-extrabold ${priorityBadgeClass[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
}

export function CategoryDot({ category, size = 10 }: { category: Category; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full ${categoryDotClass[category]}`}
    />
  );
}
