import { Router } from 'express';
import type { Prisma, Task } from '@prisma/client';
import { startOfToday, startOfTomorrow, weekAgo } from '../lib/dates.js';
import { asyncHandler, HttpError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { createTaskSchema, listQuerySchema, updateTaskSchema } from '../lib/schemas.js';

export const tasksRouter = Router();

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;

function sortTasks(tasks: Task[], sort: 'dueDate' | 'priority' | 'createdAt') {
  const byDue = (a: Task, b: Task) =>
    (a.dueDate?.getTime() ?? Infinity) - (b.dueDate?.getTime() ?? Infinity);
  return [...tasks].sort((a, b) => {
    if (sort === 'createdAt') return b.createdAt.getTime() - a.createdAt.getTime();
    if (sort === 'priority') return priorityRank[a.priority] - priorityRank[b.priority] || byDue(a, b);
    return byDue(a, b);
  });
}

tasksRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = listQuerySchema.parse(req.query);
    const where: Prisma.TaskWhereInput = {};
    if (q.status) where.status = q.status;
    if (q.priority) where.priority = q.priority;
    if (q.category) where.category = q.category;
    if (q.search) {
      where.OR = [{ title: { contains: q.search } }, { description: { contains: q.search } }];
    }

    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const dueToday = { dueDate: { gte: today, lt: tomorrow } };
    const overdue = { dueDate: { lt: today }, status: { not: 'COMPLETED' as const } };
    const and: Prisma.TaskWhereInput[] = [];
    if (q.due === 'today') and.push(dueToday);
    if (q.due === 'overdue') and.push(overdue);
    if (q.due === 'todayAndOverdue') and.push({ OR: [dueToday, overdue] });
    if (q.completed === 'week') and.push({ completedAt: { gte: weekAgo() } });
    if (and.length) where.AND = and;

    const tasks = await prisma.task.findMany({ where });
    res.json(sortTasks(tasks, q.sort));
  }),
);

async function findOr404(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new HttpError(404, 'Task not found');
  return task;
}

tasksRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await findOr404(req.params.id));
  }),
);

tasksRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: { ...data, completedAt: data.status === 'COMPLETED' ? new Date() : null },
    });
    res.status(201).json(task);
  }),
);

tasksRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findOr404(req.params.id);
    const data = updateTaskSchema.parse(req.body);
    const patch: Prisma.TaskUpdateInput = { ...data };
    if (data.status && data.status !== existing.status) {
      patch.completedAt = data.status === 'COMPLETED' ? new Date() : null;
    }
    res.json(await prisma.task.update({ where: { id: existing.id }, data: patch }));
  }),
);

tasksRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await findOr404(req.params.id);
    await prisma.task.delete({ where: { id: existing.id } });
    res.status(204).end();
  }),
);
