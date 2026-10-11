# RentNest — Frontend

A production-ready rental marketplace UI built with **Next.js (App Router)**, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, TanStack Query and Zustand. It talks to the RentNest REST API and ships role-based dashboards for **tenants**, **landlords** and **admins**, plus Stripe Checkout payments.

## Repository layout

```
.
├── src/               # Next.js app (frontend)
├── public/            # static assets
├── scripts/smoke.mjs  # API + route smoke tests
├── backend/           # RentNest REST API (Express + Prisma + Stripe)
│   ├── src/           # modules: user, properties, rentalRequest, payment, landlord, admin, review
│   ├── prisma/        # schema, migrations, seed
│   ├── api/index.js   # bundled serverless entry used by Vercel
│   └── vercel.json
└── README.md / API_INTEGRATION.md
```

## Quick start

```bash
npm install
cp .env.example .env.local   # then edit values if needed
npm run dev                  # http://localhost:3000
```

### Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://rent-nest-api-seven.vercel.app` | Base URL of the RentNest API (no trailing slash) |

Local backend instead? Point it at `http://localhost:5000`.

### Running the API from `backend/`

```bash
cd backend
npm install
npx prisma generate        # client is generated locally (gitignored)
npx prisma migrate deploy  # apply migrations to DATABASE_URL
# .env needs: DATABASE_URL, JWT secrets, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
#             CORS_ORIGIN, FRONTEND_URL
npm run dev                # http://localhost:5000
```

Useful backend scripts: `npm run build` (tsc), `npm run start`, `npm run seed` (demo data), `npm run stripe:webhook` (local Stripe events).

## Demo credentials

Seeded accounts (see `API_INTEGRATION.md` for the seed command):

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@rentnest.com` | `admin123` |
| Tenant | `tanvir@tenant.com` | `123456` |
| Landlord | `imtius1@example.com` | `12345678` |

The login screen has a **Use demo account** helper that fills these in.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |

## What's inside

### Public site
- **Home** — animated hero, category chips, featured listings, testimonials, stats (`src/components/home/sections.tsx`).
- **Browse** (`/properties`) — debounced search, location, category, min/max price filters, pagination, shareable URL query string, skeletons and empty/error states.
- **Details** (`/properties/[id]`) — gallery, highlights, description, reviews with pagination, "Request rental" CTA.
- **About**, **No access** (`/no-access`), global `error.tsx`, `not-found.tsx` and `loading.tsx` boundaries.

### Auth
- JWT access + refresh tokens in cookies, automatic single-flight refresh, Zustand session store (`src/store/auth.ts`), `Authorization: Bearer` on every request.
- `src/proxy.ts` guards `/dashboard/*` and `/auth/*` by role — tenants get redirected away from landlord routes and vice-versa.

### Dashboards
- **Tenant** — overview, rental requests tracker, **Stripe pay page**, payment history, leave reviews.
- **Landlord** — listing value stats, request approvals with **optimistic UI**, create/edit listings with live image preview, availability toggle, delete with confirm.
- **Admin** — live statistics, user block/unblock and role switching (optimistic), property moderation with confirm delete, platform-wide rentals table.

### Payments
`/dashboard/tenant/requests/[id]/pay` → `POST /api/payments/create` → Stripe Checkout → `/payment/success` (session verification) or `/payment/cancel`.

## Project structure

```
src/
├── app/                  # App Router pages (public, auth, dashboard, payment)
├── components/           # ui/ (shadcn), home/, dashboard/, landlord/, properties/
├── hooks/                # use-auth-actions, use-api-mutation, use-debounced-value
├── lib/                  # api client, queries, session, types, format, status, images
├── store/                # Zustand auth store
└── proxy.ts              # role-based route protection
```

## State management

- **Server state** — TanStack Query (query keys in `src/lib/queries.ts`, invalidation after mutations, optimistic updates for approve/decline and admin actions).
- **Client/session state** — Zustand (`src/store/auth.ts`) hydrated from cookies, persisted by the auth actions hook.
- **URL state** — browse filters live in the query string so results are shareable.

## Deployment

```bash
# Vercel (recommended)
npx vercel            # framework auto-detected as Next.js
```

Set `NEXT_PUBLIC_API_URL` in the project's environment variables, and remember to add the deployed origin to the API's `CORS_ORIGIN` / `FRONTEND_URL` (Stripe redirects back to `FRONTEND_URL/payment/success`).

See `API_INTEGRATION.md` for the full endpoint contract, auth flow and error handling.
