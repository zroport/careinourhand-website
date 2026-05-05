# Care In Our Hand — Claude Code Project Guide

> **For Claude Code (VS Code terminal agent):** Read this entire file before touching any code.
> This is the single source of truth. Complete tasks in order. Check off each item as you finish it.

---

## Session Start Ritual
1. Read this entire file
2. Find the first unchecked task below
3. Start working on it immediately — no explanations needed
4. When done, mark it `[x]` and move to the next task

---

## Project Overview

**Care In Our Hand** is an NDIS disability care provider website for a client in Leppington, NSW.
Full-stack Next.js app with a public-facing site (25+ pages) and a protected admin CMS.

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

⚠️ **Prisma 7 rules:**
- Database URL lives in `prisma.config.ts` — NOT in `schema.prisma`
- Always import Prisma client from `@/lib/prisma` — never `new PrismaClient()` anywhere else
- Enums are NOT importable from `@prisma/client` in Prisma 7 — use inline string literals
- After schema changes: `npx prisma db push` → `npx prisma generate`
- If models seem undefined: delete `node_modules/.prisma` → re-run `npx prisma generate`

---

## Dev Commands

```bash
npm run dev        # Dev server (8GB heap via cross-env)
npm run build      # Production build (runs prisma generate first)
npm run lint       # Lint

# Prisma
npx prisma db push              # Push schema changes
npx prisma generate             # Generate client
npx prisma studio               # Open DB GUI

# Seeds
npm run seed:all   # Run all seeds
npm run seed:admin # Seed admin user
```

---

## Coding Patterns (Always Follow)

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

### Auth Guard — Server Components / Actions
```typescript
const session = await auth()
if (!session?.user) redirect("/admin/login")
```

### Auth Guard — API Routes
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
- Prisma client: always import from `@/lib/prisma`
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
│   ├── (public)/         # Public routes (Header + Footer layout)
│   ├── admin/            # Protected CMS routes (Sidebar + Topbar layout)
│   └── api/              # API handlers
├── actions/admin/        # Server actions ("use server")
├── components/
│   ├── ui/               # shadcn base components
│   ├── layout/           # Header, Footer, Nav
│   ├── admin/            # Admin-only components
│   └── [feature]/        # Feature-scoped components
└── lib/
    ├── auth.ts           # NextAuth config
    ├── auth.config.ts    # Auth callbacks + route guards
    ├── prisma.ts         # Prisma singleton with PrismaPg adapter
    ├── utils.ts          # cn() helper
    └── upload.ts         # Upload utilities

prisma/
├── schema.prisma
├── prisma.config.ts      # Prisma 7 DATABASE_URL config
└── migrations/

public/
├── uploads/              # General user-uploaded files
└── uploads/logos/        # Logo uploads (created in Phase 5)

messages/                 # i18n translation files (created in Phase 7)
```

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
| Logo Manager | ✅ | ✅ | ✅ | ❌ | ❌ |
| Service Areas | ✅ | ✅ | ✅ | ❌ | ❌ |
| Site Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |

---

---

# ✅ COMPLETED WORK — DO NOT REDO

## Phase 1 — Prisma Schema (RBAC) ✅ COMPLETE
- [x] Update `UserRole` enum (SUPER_ADMIN, ADMIN, STAFF, MARKETING, ACCOUNTS)
- [x] Add `isActive` field to User model
- [x] Add `Invitation` model
- [x] Add `Page` model
- [x] Run `prisma db push`
- [x] Migrate existing admin to SUPER_ADMIN

## Phase 2 — RBAC & Auth ✅ COMPLETE
- [x] Create `src/lib/permissions.ts`
- [x] Create `src/lib/require-role.ts`
- [x] Update `src/lib/auth.ts` — reject login if `isActive = false`
- [x] Update `src/lib/auth.config.ts` — allow `/admin/setup-password` unauthenticated
- [x] Update admin sidebar — filter nav by role, add User Management + Page Manager links
- [x] Update admin layout — pass `session.user.role` to sidebar

## Phase 3 — Invitation Flow ✅ COMPLETE
- [x] Create `/admin/users` page
- [x] Create `invite-user-form.tsx` component
- [x] Create `src/actions/admin/user-actions.ts`
- [x] Create `/admin/setup-password` page
- [x] Create `src/actions/admin/setup-password-actions.ts`

## Phase 4 — Page Manager ✅ COMPLETE
- [x] Create `src/actions/admin/page-actions.ts`
- [x] Create page seed script
- [x] Create `/admin/pages` layout with sub-nav
- [x] Create `/admin/pages/page.tsx`
- [x] Create `/admin/pages/[slug]/page.tsx`
- [x] Create `src/components/admin/pages/page-editor.tsx`
- [x] Create `src/lib/page-content.ts`
- [x] Update public pages to pull content from DB

## Other Completed Tasks ✅
- [x] Replace placeholder phone and ABN in header, footer, contact, feedback, terms, privacy
- [x] Wire up Resend email for booking/referral notifications
- [x] Build admin UI for Testimonial and Media models
- [x] Fill in real Privacy Policy and Terms of Service content

---

---

# 🚀 NEW WORK — START HERE

> Phases 5–8 are brand new features that have not been started.
> Complete them in order. Do NOT skip ahead.
> Finish each phase fully and verify it works before moving to the next.

---

## Phase 5 — Logo Management System

**Goal:** Admin uploads logo variants through the CMS. Every logo location on the public website reads from the database. Zero hardcoded logo paths anywhere on the frontend.

**File storage:** `/public/uploads/logos/` — no S3, no MinIO, no cloud storage for this feature.

### Step 1 — Prisma Schema
- [x] Add `SiteLogos` model to `prisma/schema.prisma`:
  ```prisma
  model SiteLogos {
    id                String   @id @default(cuid())
    siteId            String   @default("default")
    faviconUrl        String?
    horizontalLogoUrl String?
    verticalLogoUrl   String?
    footerLogoUrl     String?
    fullHeaderLogoUrl String?
    updatedAt         DateTime @updatedAt
  }
  ```
- [x] Run: `npx prisma db push`
- [x] Run: `npx prisma generate`
- [x] Create the upload directory: `mkdir -p public/uploads/logos`

### Step 2 — API Routes

> ⚠️ **DO NOT use multer.** It is incompatible with Next.js 16 App Router.
> Use Next.js native `request.formData()` for all file handling.

- [x] Create `src/app/api/logos/route.ts` — **GET**, public, no auth required
  - Query `SiteLogos` where `siteId = "default"`
  - Return all URL fields as JSON (return empty object if no record exists yet — do not throw)

- [x] Create `src/app/api/admin/logos/upload/route.ts` — **POST**, admin auth required
  - Accept `multipart/form-data` with two fields: `logoType` and `file`
  - `logoType` must be one of: `favicon | horizontal | vertical | footer | fullHeader`
  - Allowed file types ONLY: `.jpg`, `.jpeg`, `.png`, `.svg`, `.ico`, `.webp` — reject everything else with 400
  - Generate unique filename: `${logoType}-${Date.now()}.${ext}`
  - Save file to `/public/uploads/logos/`
  - Upsert `SiteLogos` where `siteId = "default"` — update the matching URL field only
  - Return `{ url: "/uploads/logos/filename.ext" }`

### Step 3 — Admin Page `/admin/logos`
- [x] Create `src/app/admin/logos/page.tsx`
- [x] Page contains **5 upload sections**, one for each logo type:
  | # | Section | Recommended Size | Accepted Formats |
  |---|---|---|---|
  | 1 | Favicon | 32×32px or 64×64px | ICO, PNG, SVG |
  | 2 | Horizontal Logo (navbar/header) | 200×60px | PNG, SVG, WEBP |
  | 3 | Vertical Logo (login page) | 200×200px | PNG, SVG, WEBP |
  | 4 | Footer Logo | 180×50px | PNG, SVG, WEBP |
  | 5 | Full Header Logo | 400×120px | PNG, SVG, WEBP |
- [x] Each section must have:
  - Live preview of current logo (loaded from `GET /api/logos` on page mount)
  - Upload button that triggers `<input type="file" accept="...">` hidden input
  - Hint text showing recommended dimensions and accepted formats
  - Success message (green) or error message (red) after upload attempt
  - Instant preview update after successful upload — no page reload
- [x] Use existing shadcn/ui admin components (Card, Button, etc.)
- [x] Add "Logo Manager" link to the admin sidebar (`src/components/admin/sidebar.tsx`)

### Step 4 — `<SiteLogo>` Frontend Component
- [x] Create `src/components/ui/site-logo.tsx`
  - Props: `type: "favicon" | "horizontal" | "vertical" | "footer" | "fullHeader"`, optional `className`
  - Fetches logo data from `GET /api/logos` using `fetch` with `{ next: { revalidate: 3600 } }`
  - Renders an `<img>` with the correct URL for the given `type`
  - Falls back to site name text `Care In Our Hand` if no logo uploaded yet for that type
- [x] Integrate into:
  - `src/components/layout/header.tsx` → replace any hardcoded logo with `<SiteLogo type="horizontal" />`
  - `src/components/layout/footer.tsx` → replace any hardcoded logo with `<SiteLogo type="footer" />`
  - `src/app/admin/login/page.tsx` → replace any hardcoded logo with `<SiteLogo type="vertical" />`

### Step 5 — Dynamic Favicon
- [x] Update root layout `src/app/layout.tsx`:
  - Fetch favicon URL server-side (query `SiteLogos` where `siteId = "default"`)
  - Inject into `<head>`:
    ```tsx
    <link rel="icon" href={faviconUrl ?? "/favicon.ico"} />
    ```

### Phase 5 Done When:
- Admin uploads a horizontal logo → it appears immediately in the public navbar
- Admin uploads a favicon → the browser tab icon changes on next load
- No logo paths exist anywhere in the codebase as hardcoded strings

---

## Phase 6 — Global Mobile UI Fix (Horizontal Scroll + Scroll-Snap)

**Goal:** On mobile, multi-card sections change from vertical stacking to a horizontal swipe row with scroll-snap. Desktop layout stays completely unchanged.

### Step 1 — Find All Card Grid Sections
- [x] Audit the entire project and list every card-based grid section:
  - Homepage: Services grid, Testimonials, any other card sections
  - `/services` listing page: service cards
  - `/blog` listing page: blog post cards
  - `/about` page: team cards, values cards
  - `/careers` page: job listing cards
  - Any other pages with repeating card grids

### Step 2 — Apply the Scroll-Snap Pattern to Each Section
- [x] For each card grid section found above, change the mobile layout:

  **Card Container** — replace vertical-stack mobile classes with:
  ```
  flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-hide
  ```

  **Each Card** — add these classes:
  ```
  snap-start shrink-0 min-w-[280px]
  ```
  (use `min-w-[85vw]` if cards should be nearly full-width on mobile)

- [x] Add scroll-hide utility to global CSS (`src/app/globals.css`):
  ```css
  .scroll-hide::-webkit-scrollbar { display: none; }
  .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
  ```

- [x] Desktop layout (`lg:` and above) must remain EXACTLY the same as before — 3-column grid, no changes

### Step 3 — Verify
- [ ] Test at 375px viewport — cards snap cleanly when swiping left/right
- [ ] Test at 1280px viewport — layout looks identical to before this change
- [x] Apply to ALL qualifying sections across ALL pages — not just homepage

---

## Phase 7 
Read CLAUDE.md. Now start Phase 7 — Language Support.

CHANGE OF PLAN: Do NOT use next-intl. Do NOT create translation JSON files.

Instead, integrate the Google Translate Widget into the public site. This gives us automatic support for 133 world languages with zero manual translation work.

IMPLEMENTATION:

1. Create src/components/layout/google-translate.tsx — a client component that:
   - Injects the Google Translate script into the page
   - Initializes the widget targeting a div with id="google_translate_element"
   - Hides the default Google Translate banner/toolbar that appears at the top of the page (use CSS to suppress it)
   - Styles the dropdown to match the existing navbar design using Tailwind

2. Add a Globe icon (🌐) button in the navbar (desktop + mobile menu) that toggles a clean custom dropdown showing the Google Translate element inside it

3. Add this CSS to globals.css to suppress the ugly default Google toolbar:
   - Hide .goog-te-banner-frame
   - Hide body > .skiptranslate
   - Remove the top margin Google adds to body

4. Add <GoogleTranslate /> to src/components/layout/header.tsx — both desktop nav and mobile menu

5. The admin panel (/admin/*) must NOT have the translate widget — public pages only

RULES:
- No next-intl install
- No messages/ folder
- No JSON translation files
- Admin panel stays English only — do not touch /admin/* pages
- Use the existing navbar component style — the language button must match the site design

Start now.

## Phase 8 — Dynamic Service Coverage Section

**Goal:** Show which suburbs/regions the care team serves. This is home-based mobile care coverage — NOT physical office locations. Admin manages the suburb list from the CMS. Public homepage shows them as chip tags.

### Step 1 — Prisma Schema
- [x] Add `ServiceArea` model to `prisma/schema.prisma`:
  ```prisma
  model ServiceArea {
    id        String   @id @default(cuid())
    areaName  String
    isActive  Boolean  @default(true)
    order     Int      @default(0)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```
- [x] Run: `npx prisma db push`
- [x] Run: `npx prisma generate`

### Step 2 — Server Actions
- [x] Create `src/actions/admin/service-area-actions.ts` with:
  - `getServiceAreas()` — fetch all, ordered by `order` field
  - `getActiveServiceAreas()` — fetch only `isActive = true`, ordered by `order` (used on public frontend)
  - `createServiceArea(data)` — create new area
  - `updateServiceArea(id, data)` — update name or order
  - `toggleServiceAreaActive(id)` — flip `isActive` boolean
  - `deleteServiceArea(id)` — delete area

### Step 3 — Admin Panel Page
- [x] Create `src/app/admin/service-areas/page.tsx`:
  - Table of all areas: Area Name | Active (toggle) | Order | Edit | Delete
  - "Add New Area" button → inline form row or modal (keep it simple)
  - Up/Down arrow buttons or editable order number to control display order
- [x] Add "Service Areas" to admin sidebar — visible to SUPER_ADMIN, ADMIN, MARKETING only

### Step 4 — Homepage Section
- [x] Create `src/components/home/service-coverage.tsx`:
  - Add `export const dynamic = "force-dynamic"` at top
  - Heading: **"Areas We Serve"**
  - Sub-heading: *"While our main office is in Leppington, our dedicated team travels to provide care in the following areas:"*
  - Calls `getActiveServiceAreas()` — only shows `isActive = true` areas in `order` sequence
  - Renders each area as a chip/tag: `✓ Suburb Name` or `🏠 Suburb Name`
  - Section must have `id="service-areas"` for the footer scroll link
- [x] Add `<ServiceCoverage />` to `src/app/(public)/page.tsx` in a logical position (between Services and Testimonials, or after CTA)

### Step 5 — Footer Quick Link
- [x] Update `src/components/layout/footer.tsx`:
  - Add `Areas We Serve` as a quick link
  - Use `<Link href="/#service-areas">Areas We Serve</Link>`
  - This works for both: on homepage (smooth scrolls) and on other pages (navigates then scrolls)

### Phase 8 Notes
- This is text-only display — no Google Maps, no coordinates, no map API needed at all
- Only `isActive = true` areas show on the public frontend
- Admin sees and manages all areas (active and inactive)

---

## Final Verification Checklist

Run after all 4 new phases are complete:

- [x] `npm run build` — no TypeScript errors, no build failures
- [ ] `/admin/logos` page — all 5 upload sections visible and working
- [ ] Upload horizontal logo → appears in public navbar immediately
- [ ] Upload favicon → browser tab icon updates on next page load
- [ ] No hardcoded logo paths remain anywhere in the codebase
- [ ] Mobile (375px viewport) — cards swipe horizontally with snap
- [ ] Desktop (1280px viewport) — card grids look exactly as before Phase 6
- [ ] Language picker visible in navbar (only after Phase 7 — confirm language first)
- [ ] Add a service area in admin → chip appears on homepage
- [ ] Deactivate a service area in admin → chip disappears from homepage
- [ ] Footer "Areas We Serve" → smooth scrolls to section on homepage
- [ ] Footer "Areas We Serve" from `/about` page → navigates to `/#service-areas`

---

*Last updated: April 2026 — Phases 1–6 and 8 complete. Phase 7 blocked pending client language confirmation.*
