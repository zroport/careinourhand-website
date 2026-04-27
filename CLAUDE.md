# Care In Our Hand — Claude Memory File

## Session Start Ritual
1. Read this file completely
2. Find the first unchecked task below
3. Start working on it immediately — no explanations needed
4. When done, mark task complete here and move to next

---

## Project Overview
NDIS disability care provider website. Full-stack Next.js app with public site + protected admin CMS.
**Current Mission:** Upgrade to full RBAC (5 roles) + secure invitation flow + Page Manager CMS.

---

## Tech Stack
| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js App Router (standalone output) | 16.2.3 |
| Language | TypeScript strict | 5 |
| Styling | Tailwind CSS v4 + shadcn/ui | 4.2.2 |
| Database | PostgreSQL + Prisma (native PG adapter) | Prisma 7.7.0 |
| Auth | NextAuth.js beta JWT + Prisma adapter | 5.0.0-beta.31 |
| Forms | React Hook Form + Zod | latest |
| Icons | Lucide React | latest |

⚠️ **Always use webpack, never Turbopack.** Next.js 16.2.3 Turbopack has E1068 workStore bug. Already enforced in `next.config.ts`.

---

## Dev Commands
```bash
npm run dev        # Dev server (8GB heap via cross-env)
npm run build      # Production build (runs prisma generate first)
npm run lint       # Lint

# Prisma
npx prisma migrate dev --name <name>   # After schema changes
npx prisma generate                    # Generate client
npx prisma studio                      # Open DB GUI

# Seeds
npm run seed:all   # Run all seeds
npm run seed:admin # Seed admin user
```

---

## Task Tracker

### Phase 1: Prisma Schema — ✅ COMPLETE
- [x] Update `UserRole` enum (SUPER_ADMIN, ADMIN, STAFF, MARKETING, ACCOUNTS)
- [x] Add `isActive` field to User model
- [x] Add `Invitation` model
- [x] Add `Page` model
- [x] Run `prisma db push`
- [x] Migrate existing admin: `UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'admin@careinourhand.com.au'`

### Phase 2: RBAC & Auth — ✅ COMPLETE
- [x] Create `src/lib/permissions.ts` — centralized role→module map (see permission matrix below)
- [x] Create `src/lib/require-role.ts` — server-side role guard helper
- [x] Update `src/lib/auth.ts` — check `isActive` on login, reject disabled accounts
- [x] Update `src/lib/auth.config.ts` — allow `/admin/setup-password` unauthenticated
- [x] Update `src/components/admin/sidebar.tsx` — filter nav by role, add User Management + Page Manager links
- [x] Update `src/app/admin/layout.tsx` — pass `session.user.role` to sidebar

### Phase 3: Invitation Flow — ✅ COMPLETE
- [x] Create `/admin/users` page — user list + invite button + quick actions
- [x] Create `src/components/admin/users/invite-user-form.tsx` — email, name, role selector
- [x] Create `src/actions/admin/user-actions.ts` — inviteUser, toggleActive, changeRole, getUsers
- [x] Create `/admin/setup-password` page — token-gated, no auth required
- [x] Create `src/actions/admin/setup-password-actions.ts` — validateToken, completeSetup

### Phase 4: Page Manager — ✅ COMPLETE
- [x] Create `src/actions/admin/page-actions.ts` — getPage, updatePage, initializePages
- [x] Create page seed script — initialize DB records for Home, About, Services, Careers, FAQ, Contact
- [x] Create `src/app/admin/pages/layout.tsx` — sub-nav sidebar with page list
- [x] Create `src/app/admin/pages/page.tsx` — index, redirects to Home
- [x] Create `src/app/admin/pages/[slug]/page.tsx` — dynamic editor page
- [x] Create `src/components/admin/pages/page-editor.tsx` — section-based editor UI
- [x] Create `src/lib/page-content.ts` — `getPageContent(slug)` with fallback to defaults
- [x] Update public pages to pull content from DB via `getPageContent`

---

## Permission Matrix
| Module | SUPER_ADMIN | ADMIN | MARKETING | STAFF | ACCOUNTS |
|---|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Referrals | ✅ | ✅ | ❌ | ✅ | ❌ |
| Bookings | ✅ | ✅ | ❌ | ✅ | ✅ |
| Messages | ✅ | ✅ | ❌ | ✅ | ❌ |
| Feedback | ✅ | ✅ | ❌ | ✅ | ❌ |
| Applications | ✅ | ✅ | ❌ | ❌ | ❌ |
| Blog Posts | ✅ | ✅ | ✅ | ❌ | ❌ |
| Services | ✅ | ✅ | ✅ | ❌ | ❌ |
| FAQs | ✅ | ✅ | ✅ | ❌ | ❌ |
| Job Listings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Home Slider | ✅ | ✅ | ✅ | ❌ | ❌ |
| Page Headers | ✅ | ✅ | ✅ | ❌ | ❌ |
| Page Manager | ✅ | ✅ | ✅ | ❌ | ❌ |
| Site Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Coding Patterns

### Server Action Pattern
```typescript
"use server"
const schema = z.object({ /* fields */ })
export async function actionName(data: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  await prisma.model.create({ data: parsed.data })
  revalidatePath("/admin/page")
  redirect("/admin/page")
}
```

### Auth Guard (server components/actions)
```typescript
const session = await auth()
if (!session?.user) redirect("/admin/login")
```

### Auth Guard (API routes)
```typescript
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
```

### Parallel DB Fetching
```typescript
const [count, items] = await Promise.all([
  prisma.model.count(),
  prisma.model.findMany({ orderBy: { createdAt: "desc" } }),
])
```

### Key Rules
- Prisma client: always import from `@/lib/prisma` — never `new PrismaClient()`
- Dynamic pages: `export const dynamic = "force-dynamic"`
- File names: kebab-case components, camelCase utilities
- Component names: PascalCase exports, `ComponentNameProps` interfaces
- Constants: UPPER_SNAKE_CASE
- Tailwind: mobile-first `base → sm: → lg: → xl:`

---

## Folder Structure
```
src/
├── app/
│   ├── (public)/         # Public routes
│   ├── admin/            # Protected CMS routes
│   └── api/              # API handlers
├── actions/admin/        # Server actions ("use server")
├── components/
│   ├── ui/               # shadcn base
│   ├── layout/           # Header, Footer
│   ├── admin/            # Admin-only components
│   └── [feature]/        # Feature components
└── lib/
    ├── auth.ts           # NextAuth config
    ├── auth.config.ts    # Auth callbacks + route guards
    ├── prisma.ts         # Prisma singleton
    ├── utils.ts          # cn() helper
    └── upload.ts         # Upload utilities

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

## Key File Locations
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Database schema |
| `src/lib/auth.ts` | NextAuth config |
| `src/lib/auth.config.ts` | Route guards + callbacks |
| `src/components/admin/sidebar.tsx` | Admin nav (needs role filtering) |
| `src/app/admin/layout.tsx` | Admin layout (needs to pass role) |
| `.env` | Environment variables |

---

## Pending Non-RBAC Tasks (do after Phase 4)
- [x] Replace placeholder `1300 XXX XXX` and ABN in header, footer, contact, feedback, terms, privacy
- [x] Wire up email provider (Resend recommended) for booking/referral notifications
- [x] Build admin UI for Testimonial, Media models
- [x] Fill in real Privacy Policy and Terms of Service content

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
