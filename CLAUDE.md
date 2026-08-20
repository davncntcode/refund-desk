@AGENTS.md

# Refund Desk

Internal, staff-facing tool for a support team to log, review and resolve customer
refund requests. Scope and decisions are in `README.md`; the visual language is in
`docs/DESIGN-SYSTEM.md`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 + shadcn/ui (radix base) |
| Forms | react-hook-form + zod — one schema per form, shared with the action |
| Data | Drizzle ORM over libSQL (SQLite file locally, Turso in production) |
| Reads | Server Components calling `lib/db/queries.ts` |
| Writes | Server Actions in `app/actions/`, re-validated with zod |

No Redux/Zustand/TanStack Query. No REST or tRPC layer — Server Actions are the API.
List state lives in the URL, not in a client store.

## Layout

```
app/
  (app)/                    the shell: sidebar, topbar, force-dynamic
    page.tsx                dashboard
    refunds/                list and detail
  actions/refunds.ts        createRefund, updateRefundStatus
  api/refunds/export/       csv of the current filtered view
lib/
  domain.ts                 status and category tuples — zero dependencies, leaf module
  status.ts                 transition map, note rules, status presentation
  reasons.ts                reason category presentation
  refund-filters.ts         search param parsing and url building
  format.ts                 money, dates, durations, amount parsing
  csv.ts                    rfc 4180 escaping
  db/{index,schema,queries,seed}.ts
  validation/refund.ts      zod schemas
components/{ui,shell,refunds,dashboard}/
drizzle/                    generated migrations, forward only
e2e/                        playwright
```

## Rules

- **Money is integer cents** in TypeScript and `integer` in SQLite. Never a float on an
  amount. Format only through `lib/format.ts`.
- **Timestamps** are `timestamp_ms`, stored and rendered UTC.
- **Every status change goes through `updateRefundStatus`**, which re-checks
  `canTransition` and writes a `refund_status_events` row in the same transaction. Never
  update `status` directly.
- **The transition map in `lib/status.ts` is the single source of truth.** UI, action and
  tests all read it. Adding a status means updating the map and the tests together.
- **Server Actions re-validate with zod** and return `{ ok: false, message, fieldErrors }`
  rather than throwing at the UI. The form sends raw input; the action does the real parse.
- **Colours, type and spacing come from the tokens in `app/globals.css`.** Never hard-code
  a hex in a component. Pastel tints are always used as the `bg-x text-x-fg` pair.
- **`lib/domain.ts` must stay dependency-free** — `lib/db/schema.ts` imports it and
  drizzle-kit bundles that file outside the Next build.
- **Never hand-edit `drizzle/`.** Change `lib/db/schema.ts`, then `npm run db:generate`.
- **Comments are one line, three to five words**, and only where the reason is not obvious
  from the code. No file headers, no JSDoc blocks.
- `lint`, `typecheck`, `build` and `test` all pass before a change is done.

## Commands

```bash
npm run dev
npm run lint · npm run typecheck · npm run build
npm test · npm run e2e
npm run db:generate · npm run db:migrate · npm run db:seed · npm run db:studio
```

## Commit style

Conventional prefix, lowercase one-line subject, no body, no trailers.
`feat: add refund detail with status workflow and timeline`
