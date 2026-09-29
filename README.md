# Zenitty

A full-stack to-do list web app. React + Vite + TypeScript + Tailwind on the client, Express + Prisma (SQLite) on the server. Single user, no auth in v1 — the display name comes from an env var.

![Zenitty laptop dashboard](docs/design/Zenitty-Laptop-Dashboard.png)

| Home | Add task | Task detail | Dark mode |
|---|---|---|---|
| <img src="docs/design/Zenitty-Mobile-Home.png" width="180" /> | <img src="docs/design/Zenitty-Mobile-Add-Task.png" width="180" /> | <img src="docs/design/Zenitty-Mobile-Task-Detail.png" width="180" /> | <img src="docs/design/Zenitty-Mobile-Dark-Mode.png" width="180" /> |

## Features
- Task CRUD with a complete/incomplete toggle and a confirm dialog before delete
- Priority (badge + segmented control) and category (dot + select / pills)
- Dashboard stat cards (due today, overdue, all, completed this week) — click a card to filter the list
- Search, status chips, priority/category filter and sort, all kept in URL query params
- Dark mode: follows `prefers-color-scheme` on first visit, toggle in the sidebar (laptop) or header (mobile), saved in localStorage
- Responsive: laptop (3 columns), tablet (icon sidebar + modal), mobile (pages + bottom sheet)

## Setup
Requires Node 20+.

```bash
npm install
cp .env.example .env
npm run seed      # creates the SQLite DB, runs migrations, loads sample tasks
npm run dev       # client http://localhost:5173, API http://localhost:4000
```

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Runs client and server together |
| `npm run build` | Builds server and client |
| `npm run lint` | Lints both workspaces |
| `npm run seed` | Applies migrations and reseeds sample data (**replaces all tasks**) |

## Environment
See [`.env.example`](.env.example): `PORT`, `DATABASE_URL`, `CLIENT_ORIGIN`, `VITE_USER_NAME`, `VITE_API_URL`.

## Project docs
- [AGENTS.md](AGENTS.md) — stack, folder map, conventions, API contract, design system and Git workflow
- [docs/design](docs/design) — mockups (the UI source of truth)

## Hosting notes
The API and client are separate builds. Build with `npm run build`, serve `client/dist` as static files, run `node server/dist/index.js` (after `npm run db:deploy -w server`) and set `CLIENT_ORIGIN` / `VITE_API_URL` for your domain. To move to PostgreSQL, change the Prisma datasource provider and `DATABASE_URL`, then regenerate migrations.
