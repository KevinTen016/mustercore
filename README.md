# MusterCore

A full-stack WaaS (Website-as-a-Service) platform built for local German businesses — hairdressers, medical practices, auto shops. Includes a public marketing site, a demo request flow, and a password-protected admin panel.

**Live demo:** [link once deployed]

> This is a portfolio/demo project. All company data is fictional. Admin credentials below.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | PostgreSQL 16 + Prisma ORM |
| Styling | CSS Modules + CSS custom properties |
| Email | Resend (optional) |
| Auth | Custom session-based (httpOnly cookie) |
| Container | Docker + Docker Compose |

---

## Features

- **Marketing site** — multi-page site with pricing, industry pages, blog, FAQ, legal pages
- **Demo request quiz** — multi-step form with deduplication and email notification via Resend
- **Contact form** — stores messages in the database, sends email notification
- **Admin panel** — standalone SPA at `/admin`; manages demo requests, customers, messages
- **Security** — rate limiting, timing-safe password comparison, CSP headers, soft deletes
- **GDPR-ready** — cookie consent banner, local fonts (no Google Fonts CDN), EU hosting in mind

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or use the Docker setup below)

### Without Docker

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL, ADMIN_USER, ADMIN_PASSWORD

# 3. Run database migrations
npm run db:migrate

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### With Docker (recommended)

```bash
# 1. Copy and edit the env file
cp .env.example .env.local
# Minimum required: set POSTGRES_PASSWORD and ADMIN_PASSWORD in .env.local

# 2. Start everything (DB + migrations + app)
docker compose up --build
# → http://localhost:5000

# Dev mode with hot reload:
docker compose --profile dev up --build
# → http://localhost:3001
```

---

## Admin panel

The admin panel lives at `/admin`. It manages demo requests, customers, and contact messages.

**Demo credentials:**
```
Username: admin
Password: demo1234
```

To populate the admin with demo data (customers, requests, messages), run:
```bash
npm run db:seed
```

> For your own deployment, generate a hashed password:
> ```bash
> node scripts/gen-password-hash.mjs
> ```
> Then set `ADMIN_PASSWORD_HASH` in your `.env.local`.

---

## Project structure

```
src/
├── app/              # Next.js App Router pages + API routes
│   └── api/          # auth, demos, kunden, nachrichten, health
├── components/
│   ├── layout/       # Header, Footer, CookieBanner
│   └── ui/           # HeroBlobWidget, HeroTypewriter, etc.
├── data/             # Typed content (pricing, add-ons, industries, firm info)
├── lib/              # db.ts (Prisma wrapper), session.ts, logger.ts
└── styles/
    ├── tokens.css    # Design tokens (shared with admin panel)
    └── globals.css
prisma/
└── schema.prisma     # Kunde, Demo, Nachricht models
public/
├── admin.html        # Admin SPA entry point
└── admin.js          # Admin SPA bundle
```

---

## Environment variables

See [`.env.example`](.env.example) for all required and optional variables.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `POSTGRES_PASSWORD` | Docker only | Used in docker-compose |
| `ADMIN_USER` | Yes | Admin login username |
| `ADMIN_PASSWORD_HASH` | Recommended | Scrypt hash (via `scripts/gen-password-hash.mjs`) |
| `ADMIN_PASSWORD` | Fallback | Plaintext password (migrate to hash for production) |
| `RESEND_API_KEY` | No | If set, enables email notifications |
| `RESEND_FROM` | No | Sender address for emails |
| `ADMIN_EMAIL` | No | Where admin notifications are sent |
| `NEXT_PUBLIC_BASE_URL` | Yes | Full URL of the site (no trailing slash) |

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations (dev)
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Fill the database with demo data (idempotent)
node scripts/gen-password-hash.mjs   # Generate hashed admin password
```
