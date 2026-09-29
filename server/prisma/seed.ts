import { Category, Priority, PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Dates are relative to "now" so the dashboard numbers match the mockups on any day:
// 5 due today, 2 overdue, 27 total, 21 completed this week.
const at = (dayOffset: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};

type Seed = {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  category: Category;
  dueDate?: Date;
  completedAt?: Date;
  createdAt?: Date;
};

const open: Seed[] = [
  {
    title: 'Prepare weekly meal plan',
    description: 'Plan breakfast and lunch for the week, then list what to buy.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'Health',
    dueDate: at(0, 9, 45),
    createdAt: at(-2, 20),
  },
  { title: 'Review client proposal', status: 'TODO', priority: 'HIGH', category: 'Work', dueDate: at(0, 12) },
  { title: 'Buy groceries', status: 'TODO', priority: 'LOW', category: 'Shopping', dueDate: at(0, 17, 30) },
  { title: 'Pay electricity bill', status: 'TODO', priority: 'MEDIUM', category: 'Personal', dueDate: at(-1, 18) },
  { title: 'Renew car insurance', status: 'TODO', priority: 'HIGH', category: 'Personal', dueDate: at(-2, 12) },
  { title: 'Plan weekend trip', status: 'TODO', priority: 'LOW', category: 'Personal', dueDate: at(1, 10) },
];

const doneToday: Seed[] = [
  {
    title: 'Morning run, 5 km',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'Health',
    dueDate: at(0, 7),
    completedAt: at(0, 7, 10),
  },
  {
    title: 'Write standup notes',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'Work',
    dueDate: at(0, 9),
    completedAt: at(0, 9, 5),
  },
];

const doneEarlier: [string, Category, Priority][] = [
  ['Send invoice to Acme', 'Work', 'HIGH'],
  ['Update project roadmap', 'Work', 'MEDIUM'],
  ['Reply to recruiter emails', 'Work', 'LOW'],
  ['Prepare sprint demo', 'Work', 'HIGH'],
  ['Fix login bug report', 'Work', 'MEDIUM'],
  ['Book team lunch', 'Work', 'LOW'],
  ['Refactor billing module', 'Work', 'MEDIUM'],
  ['Call mum', 'Personal', 'MEDIUM'],
  ['Renew gym membership', 'Personal', 'LOW'],
  ['Clean the apartment', 'Personal', 'LOW'],
  ['Return library books', 'Personal', 'LOW'],
  ['Yoga session', 'Health', 'LOW'],
  ['Book dentist check-up', 'Health', 'MEDIUM'],
  ['Refill vitamins', 'Health', 'LOW'],
  ['Buy birthday gift', 'Shopping', 'MEDIUM'],
  ['Order printer ink', 'Shopping', 'LOW'],
  ['Pick up dry cleaning', 'Shopping', 'LOW'],
  ['Renew passport photos', 'Other', 'LOW'],
  ['Backup phone photos', 'Other', 'LOW'],
];

const earlier: Seed[] = doneEarlier.map(([title, category, priority], i) => ({
  title,
  category,
  priority,
  status: 'COMPLETED',
  dueDate: at(-((i % 6) + 1), 15),
  completedAt: at(-((i % 6) + 1), 16, (i * 7) % 60),
}));

async function main() {
  await prisma.task.deleteMany();
  for (const t of [...open, ...doneToday, ...earlier]) {
    await prisma.task.create({ data: t });
  }
  console.log(`Seeded ${await prisma.task.count()} tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
