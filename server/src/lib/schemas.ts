import { z } from 'zod';

export const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;
export const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const categories = ['Work', 'Personal', 'Health', 'Shopping', 'Other'] as const;

const dueDate = z
  .string()
  .datetime({ offset: true })
  .transform((s) => new Date(s))
  .nullable();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).nullish(),
  status: z.enum(statuses).default('TODO'),
  priority: z.enum(priorities).default('MEDIUM'),
  category: z.enum(categories).default('Other'),
  dueDate: dueDate.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(2000).nullable(),
    status: z.enum(statuses),
    priority: z.enum(priorities),
    category: z.enum(categories),
    dueDate,
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'Provide at least one field to update');

export const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(statuses).optional(),
  priority: z.enum(priorities).optional(),
  category: z.enum(categories).optional(),
  sort: z.enum(['dueDate', 'priority', 'createdAt']).default('dueDate'),
  // Used by the dashboard stat cards: today = due today, overdue = past due and not completed,
  // todayAndOverdue = the default "Today's tasks" list.
  due: z.enum(['today', 'overdue', 'todayAndOverdue']).optional(),
  completed: z.enum(['week']).optional(),
});
