# dn-orbit

Official platform for **DevNation**, a university developer club. **dn-orbit** is a full-stack web application designed to manage club activities, track member contributions (GitHub & LeetCode), and showcase projects.

## Project Modules

| # | Module | Key Responsibility |
|---|--------|--------------------|
| 1 | Auth & Onboarding | GitHub OAuth, session management, and onboarding profile setup |
| 2 | GitHub Stats | GitHub API integration and statistic caching |
| 3 | LeetCode Stats | LeetCode public GraphQL API integration and caching |
| 4 | Leaderboard | Scoring engine, nightly computation cron, and UI |
| 5 | CMS — Events | Event management (CRUD), registration, and feedback |
| 6 | Members Section | Public member directory, bios, and visibility controls |
| 7 | Admin Panel | Role-Based Access Control (RBAC) and administrative dashboards |
| 8 | Infra & DevOps | Schema management, CI/CD, and Vercel environment setup |
| 9 | Projects Showcase | Project submission, approval workflow, and milestone tracking |

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.1 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **UI** | React 19.2.4, Tailwind CSS v4 |
| **Database** | Neon (PostgreSQL, Serverless) |
| **ORM** | Prisma 7 |
| **Auth** | NextAuth.js (GitHub OAuth only) |
| **Deployment** | Vercel |
| **Package Manager** | Bun |
| **Linting** | ESLint 9 |

---

## Project Structure

```text
app/
  (auth)/             # login page, OAuth callback
  (dashboard)/        # protected member-facing pages
    leaderboard/
    projects/
    events/
    members/
  admin/              # admin-only pages (RBAC enforced by middleware)
  api/                # Route Handlers only
  layout.tsx          # root layout
  globals.css

components/
  ui/                 # primitive UI components
  layout/             # shell components (Navbar, Sidebar)
  features/           # module-specific components

lib/
  db.ts               # Prisma client singleton (always import from here)
  auth.ts             # Auth and session helpers
  utils.ts            # shared utilities

prisma/
  schema.prisma       # database schema source of truth
```

---

## Development Guidelines

### Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```
2. **Setup environment**:
   ```bash
   cp .env.example .env
   # Fill in DATABASE_URL, NEXTAUTH_SECRET, and GITHUB keys
   ```
3. **Database initialization**:
   ```bash
   bunx prisma generate
   bunx prisma migrate dev
   ```
4. **Run development server**:
   ```bash
   bun dev
   ```

### Database & ORM
- **Singleton Pattern**: Always import `db` from `@/lib/db`.
- **No Raw SQL**: All database access must go through the Prisma ORM.
- **Prisma Studio**: Use `bunx prisma studio` for a visual database browser.

### Auth & Roles
- **Provider**: GitHub OAuth is the only supported authentication method.
- **Roles**: `admin` and `member`. Admin access is required for any `/admin/*` routes.
- **Middleware**: Authentication and RBAC are enforced at the middleware layer.

### Stats Fetching & Leaderboard
- **Cache Pattern**: Stats (GitHub/LeetCode) are cached for 24 hours. Refetch only if `fetched_at` is stale.
- **Nightly Scoring**: Leaderboard scores are computed nightly via cron jobs. Never compute scores on-the-fly for the leaderboard UI.

### Code Conventions
- **Exports**: Use named exports for components (except for `page.tsx` and `layout.tsx`).
- **Boundaries**: Modules should only share data via the database or internal API routes.
- **Strict Typing**: No `any` types; no non-null assertions without justification.
- **Styling**: Use Tailwind CSS v4 utility classes exclusively.

---

## Environment Variables

The following variables must be configured in your `.env` file:

- `DATABASE_URL`: Pooled connection string for queries.
- `DIRECT_URL`: Direct connection string for migrations.
- `NEXTAUTH_SECRET`: Random secret for session encryption.
- `NEXTAUTH_URL`: Canonical URL of the application.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: GitHub OAuth application credentials.
