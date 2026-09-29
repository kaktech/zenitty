# AGENTS.md — Zenitty

Guidance for AI agents and contributors working in this repo.

## 1. Project overview
Zenitty is a full-stack to-do list web app (single user, no auth in v1). The display name ("Johnny") comes from the `VITE_USER_NAME` env var.

**Stack**
- Monorepo with npm workspaces
- `/client`: React 18 + Vite + TypeScript + Tailwind CSS, TanStack Query, React Router, lucide-react
- `/server`: Node.js + Express + TypeScript, Zod validation
- Database: SQLite via Prisma (kept Prisma-only so it can move to PostgreSQL later)

## 2. Folder map
```
/client            React app (src/components, src/pages, src/hooks, src/lib)
/server            Express API (src/routes, src/lib) and prisma/ (schema, migrations, seed)
/docs/design       Mockup PNGs — source of truth for the UI
.env.example       Environment variables (copy to .env)
AGENTS.md          This file
```

## 3. Commands
```bash
npm install                       # install all workspaces
cp .env.example .env              # first time only
npm run seed                      # create tables + sample data (server/prisma)
npm run dev                       # client (5173) + server (4000) together
npm run build                     # build server and client
npm run lint                      # lint both workspaces
```

## 4. Coding conventions
- TypeScript strict mode everywhere; no `any` unless justified.
- Functional components and hooks only.
- Tailwind only. Use the theme tokens from `client/tailwind.config.ts` (backed by CSS variables in `client/src/index.css`). **Never hardcode colors in components.**
- Server input is validated with Zod; errors use `{ error: { message, details? } }`.
- Buttons never wrap text; touch targets are at least 44px; every input has a label; focus rings are visible.

## 5. Data model (Prisma `Task`)
| Field | Type |
|---|---|
| id | string (cuid) |
| title | string, required |
| description | string, optional |
| status | `TODO` \| `IN_PROGRESS` \| `COMPLETED` |
| priority | `LOW` \| `MEDIUM` \| `HIGH` |
| category | `Work` \| `Personal` \| `Health` \| `Shopping` \| `Other` |
| dueDate | DateTime, optional |
| completedAt | DateTime, nullable |
| createdAt, updatedAt | DateTime |

Note: SQLite has no native enums, so status/priority/category are stored as strings and enforced with Zod.

## 6. API contract (`/api`)
- `GET /tasks?search=&status=&priority=&category=&sort=dueDate|priority|createdAt`
- `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`
- `GET /stats` → `{ today, overdue, all, completedThisWeek }`
- `GET /categories/counts` → `{ Work, Personal, Health, Shopping, Other }` (task counts)
- Status codes: 200, 201, 204, 400 (validation), 404, 500.
- Error shape: `{ error: { message, details? } }`.
- Completing a task sets `completedAt`; un-completing clears it.

## 7. Git workflow
- Default branch `main`. Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`). Small commits.
- One branch + PR per feature, each branched from the latest `main`:
  1. `chore/project-setup`
  2. `feature/api-tasks-crud`
  3. `feature/task-crud-ui`
  4. `feature/priority-category`
  5. `feature/dashboard-stats`
  6. `feature/search-filter-sort`
  7. `feature/dark-mode`
  8. `feature/responsive-polish`
- Finish a branch by opening a PR (summary, checklist, testing notes), merging it and deleting the branch. Without `gh`/remote: `git merge --no-ff` locally.
- Tag `v1.0.0` at the end.

## 8. Design system
Always compare against `/docs/design/*.png`. Tokens live in `tailwind.config.ts` + `index.css`.

**Light theme**
- Page `#E3F1EA`, surface `#FFFFFF`, subtle `#F4FAF7`, list rows `#F6FBF8`
- Border `#D3E6DC`, input border `#C5DDD0`
- Primary `#2F6B4F`, primary text on light fills `#1E4D38`
- Text `#17332A`, secondary `#34503F`, muted `#4F6B60`, danger `#B23A22`

**Stat cards (bg / label)**: Due today `#BFE3CF`/`#1E4D38` · Overdue `#F8D9D0`/`#7A2E1D` · All tasks `#D7ECD9`/`#1E4D38` · Completed this week `#D9D2F0`/`#43357A`

**Priority badges (bg / text)**: High `#F8D9D0`/`#7A2E1D` · Medium `#FBE9C4`/`#6E4A0B` · Low `#D7ECD9`/`#1E4D38`

**Category dots**: Work `#2F6B4F` · Personal `#7B6BC0` · Health `#D0664E` · Shopping `#C9962B` · Other `#6F8A7E`

**Dark theme**: background `#0F1A16`, surface `#172520`, text `#E6F2EC`, muted `#9DB5AB`, accent `#8FD1B0`; stat cards `#24473A`, `#4A2E2A`, `#22392E`, `#332D4A` with pastel labels.

**Typography**: Nunito 400–900. Greeting 26px/800 laptop, 20px/800 mobile. Stat numbers 68px/900 laptop, 52px/900 mobile. Task titles 15px/800. Meta 12–13px/700 muted. Section labels uppercase 12px/800, letter-spacing 1px.

**Shapes**: stat cards 20px radius, rows 14–16px, inputs/buttons 12–14px, floating "+" 20px, chips/badges fully rounded. Only the floating "+" has a shadow (soft green); everything else is flat.

**Icons**: lucide-react, stroke 2. Task checkbox = 22px circle, 2px primary border, inside a 44×44 button. Completed = filled primary circle with white check; title struck through in muted color. Overdue meta lines are danger red.

## 9. Layouts
**Laptop (≥1024px)** — three columns:
1. Sidebar 248px, white: logo (green rounded square with check + "Zenitty"), nav (Dashboard, All tasks, Today, Completed; active = solid primary bg, white text), "CATEGORIES" with dots + counts, "Dark mode" button pinned to the bottom.
2. Main: header row (avatar, "Hello, Johnny", date + "· N tasks due today", 300px search, primary "Add task"); 4-col stat grid (150px cards); white "Today's tasks" card with status chips (All / To do / In progress / Completed), Filter and "Sort: Due date"; rows with the selected row having a 2px primary border.
3. Task detail panel 360px, white: close button; Task name, Description, Status + Category side by side, 3-button Priority segmented control (selected uses badge colors + darker border), Due date; footer "Save changes" + red-outline trash button.

**Tablet (768–1023px)**: sidebar collapses to icons; Task detail opens as a modal.

**Mobile (<768px)**: Home (header with theme toggle, full-width search, 2×2 stat grid of 118px cards, task cards, filter icon → bottom sheet, 60px floating "+"); Add Task (full-screen, round back button, white card, category pill chips, pinned "Create task"); Task Detail (hero card, row list, "Mark as complete", "Delete task"); Dark mode uses the dark tokens.

**Every size**: touch targets ≥44px, no horizontal scroll at 360px, visible focus rings, labelled inputs, WCAG AA contrast in both themes, buttons never wrap, and empty / loading / error states styled to match.

## 10. Definition of done
- [ ] Matches the mockup
- [ ] Works at 1440px and 360px
- [ ] Works in light and dark mode
- [ ] No console errors
- [ ] `npm run lint` and `npm run build` pass

## 11. Roadmap / not in v1
- Subtasks
- Auth / multi-user
- PostgreSQL deployment
