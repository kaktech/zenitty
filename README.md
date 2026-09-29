# Zenitty

A full-stack to-do list web app: React + Vite + Tailwind on the client, Express + Prisma (SQLite) on the server.

## Setup
```bash
npm install
cp .env.example .env
npm run seed      # available after the API branch
npm run dev       # http://localhost:5173 (API on :4000)
```

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Runs client and server together |
| `npm run build` | Builds both |
| `npm run lint` | Lints both |

## Design
Mockups live in [`docs/design`](docs/design). See [AGENTS.md](AGENTS.md) for the design system, API contract and Git workflow.
