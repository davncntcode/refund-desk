# Refund Desk

An internal tool for a support team to manage customer refund requests. A request
is logged with the customer's name and email, the amount, and why they want their
money back; from there the team filters the queue, reviews each one and moves it
through a status workflow that keeps a record of every decision.

## What it does

| Screen | What it is for |
| --- | --- |
| `/` | The queue at a glance — what is waiting, what is approved but unpaid, what has been refunded in the last 30 days, average time to resolve, daily intake, and the five requests that have been waiting longest |
| `/refunds` | The full list: filter by status, search by name, email or reference, sort by date or amount, page through, export the current view as CSV |
| `/refunds/[id]` | One request in full, the moves that are legal from where it stands, and the history of every status change with its note |

Creating a request is available from the header on every screen.

## The status workflow

```
pending ──→ in_review ──→ approved ──→ refunded
   │            │
   └──→ rejected ←┘
```

`rejected` and `refunded` are terminal. The rules live in one place,
[`lib/status.ts`](lib/status.ts), and are used three ways: the detail page only renders
the transitions that are legal from the current status, the Server Action re-checks the
same map before writing (so a request posted directly cannot skip review), and the unit
tests walk all 25 status pairs to confirm only the five legal ones pass.

Rejecting requires a note. Approving and refunding accept one. Every change writes a row
to `refund_status_events` **in the same transaction** as the status update, so the history
can never disagree with the request.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 + shadcn/ui on the radix base, on the Signal visual direction (`docs/DESIGN-BRIEF.md`) |
| Type | Inter Tight via `next/font` |
| Forms | react-hook-form + zod, one schema shared by the form and the action |
| Data | Drizzle ORM over libSQL — a local SQLite file in development, Turso in production |
| Reads | Server Components querying Drizzle directly |
| Writes | Server Actions, re-validated with zod at the boundary |
| Tests | vitest for the rules, Playwright for the flow |

**Why libSQL rather than Postgres.** One environment variable is the difference between a
local file and a hosted database, so a clean checkout runs with no services to install and
the same code deploys for the team. The schema is plain Drizzle, so moving to Postgres later
is a dialect change, not a rewrite.

**Why Server Actions rather than a REST or tRPC layer.** There are two writes in the whole
application. An API layer would be indirection with nothing in it.

**No client state library.** The filter, search term, sort and page live in the URL and are
read on the server, which makes any view of the queue a link somebody can paste into chat.

## Running it

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed        # 44 demo requests spread across every status
npm run dev            # http://localhost:3000
```

The seed is deterministic, so the dashboard, the list and any screenshot look the same on
every machine. `npm run db:seed` clears both tables before inserting.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm test               # 63 unit tests — transitions, validation, csv, money, filters
npm run e2e            # Playwright: log a request, filter to it, walk it to refunded
```

The e2e run builds the app and points it at its own database (`data/e2e.db`), wiped and
migrated before the server starts, so it never touches development data.

## Deploying

Set `DATABASE_URL` to a `libsql://` URL and `DATABASE_AUTH_TOKEN` to its token, then run
`npm run db:migrate` against it once. Nothing else changes. Migrations in `drizzle/` are
forward-only and generated — edit `lib/db/schema.ts` and run `npm run db:generate`.

## Things worth knowing

- **There is no authentication.** It was scoped as an internal tool behind whatever the
  team already sits behind. That is the one thing to add before this is exposed: Server
  Actions are reachable by direct POST, so an auth check belongs at the top of each one.
  It also means status changes record *what* happened and *when*, but not *who* — adding an
  actor is a column on `refund_status_events` plus a value from the session.
- **Money is integer cents** everywhere, in TypeScript and in SQLite. No float ever touches
  an amount. Formatting happens once, in `lib/format.ts`.
- **Timestamps are stored UTC** and rendered UTC, labelled as such.
- **CSV export** neutralises cells beginning with `=`, `+`, `-` or `@` so a reason field
  cannot become a spreadsheet formula, and is capped at 5000 rows.
- `npm audit` reports a moderate advisory against `esbuild` reached through `drizzle-kit`.
  It affects the esbuild dev server, is a development-only dependency, and the fix available
  is a four-year-old `drizzle-kit`. Left in place deliberately.
