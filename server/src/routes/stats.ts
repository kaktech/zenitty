import { Router } from 'express';
import { startOfToday, startOfTomorrow, weekAgo } from '../lib/dates.js';
import { asyncHandler } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { categories } from '../lib/schemas.js';

export const statsRouter = Router();

statsRouter.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const today = startOfToday();
    const [todayCount, overdue, all, completedThisWeek] = await Promise.all([
      prisma.task.count({ where: { dueDate: { gte: today, lt: startOfTomorrow() } } }),
      prisma.task.count({ where: { dueDate: { lt: today }, status: { not: 'COMPLETED' } } }),
      prisma.task.count(),
      prisma.task.count({ where: { completedAt: { gte: weekAgo() } } }),
    ]);
    res.json({ today: todayCount, overdue, all, completedThisWeek });
  }),
);

statsRouter.get(
  '/categories/counts',
  asyncHandler(async (_req, res) => {
    const groups = await prisma.task.groupBy({ by: ['category'], _count: { _all: true } });
    const counts = Object.fromEntries(categories.map((c) => [c, 0])) as Record<string, number>;
    for (const g of groups) counts[g.category] = g._count._all;
    res.json(counts);
  }),
);
