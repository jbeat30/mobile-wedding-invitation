# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # Dev server (Turbo mode)
pnpm build                # Production build
pnpm start                # Production server
pnpm lint                 # ESLint
pnpm format               # Prettier write
pnpm format:check         # Prettier check (CI)
pnpm test:e2e             # Playwright (headless, Mobile Chrome only)
pnpm test:e2e:headed      # Playwright headed
pnpm test:e2e:ui          # Playwright UI runner
pnpm test:e2e:debug       # Playwright debug mode
pnpm hash-password        # Generate bcrypt hash for admin passwords
```

E2E tests live in `tests/e2e/` and run against `http://localhost:3000`. The dev server is started automatically by Playwright via `webServer` config. Tests target Mobile Chrome (`Pixel 5`) only — Mobile Safari is disabled due to WebKit issues.

## Path Aliases

`@/` maps to `src/`. All imports should use this alias rather than relative paths.

## Architecture Overview

This is a **mobile-first wedding invitation app** with two distinct surfaces:

### Public invitation (single-page, `/`)
- `src/app/page.tsx` is a server component that loads all invitation data from Supabase, then hands it to `PublicPageClient.tsx`.
- `PublicPageClient` is the sole client entry point for the public page. It renders all sections in order, wires up GSAP scroll-trigger animations via `data-animate` attributes, handles BGM playback, and enforces content-protection guards (copy/drag/context-menu prevention — only on non-localhost).
- Heavy sections (`GallerySection`, `AccountsSection`, `GuestbookSection`, `RSVPSection`, `ShareSection`, `ClosingSection`) are dynamically imported via `next/dynamic` for code splitting.
- Animations use GSAP + ScrollTrigger, also dynamically imported. Supported types via `data-animate`: `fade-up` (default), `fade`, `scale`, `stagger`. Stagger children are marked with `data-animate-item`.

### Admin CMS (`/admin/*`)
- Protected by `src/middleware.ts` — all `/admin` routes except `/admin/login` require a valid JWT access token cookie (`admin_access_token`). If only a refresh token exists, the middleware redirects to `/api/admin/refresh`.
- The `(admin)` route group keeps admin pages out of the public URL namespace without affecting routes.
- The admin dashboard is a single page (`/admin`). Navigation between sections is client-side only — `AdminContentRouter` reads `activeTab` from the Zustand store and dynamically imports the matching `AdminSection*` component. There are no nested admin page routes in use; the `content/`, `guests/` subdirectories are unused scaffolding.
- Admin sections are form-based server actions. Each action (`src/app/(admin)/admin/actions/*.ts`) calls `requireAdminSession()`, writes to Supabase, then calls `revalidateAdmin()` / `revalidatePublic()` to bust Next.js ISR caches.

## State Management

**Zustand** (`src/stores/adminStore.ts`) is the only global state store. It manages all admin dashboard UI state: active tab, sidebar, modals, gallery drag state, pagination, place search results, and the loaded `AdminDashboardData`. It uses immer middleware for mutations.

The public page has no global state — everything is prop-driven from the server-loaded `InvitationMock` type.

## Data Layer & Supabase

All content is stored in Supabase. The admin client is created via `src/lib/supabaseAdmin.ts` using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server-only).

**Table structure** — each `invitation_*` table has an `invitation_id` FK to `invitations`. Most tables are 1:1 with the invitation (one row per section, created on demand by `ensureSingleRow` in `data.ts`). The exceptions are:
- `invitation_gallery_images` → many-to-one via `gallery_id`, ordered by `sort_order`
- `invitation_account_entries` → many-to-one via `accounts_id`, ordered by `sort_order`, grouped by `group_type` (`groom`/`bride`)
- `invitation_guestbook_entries` → many-to-one via `guestbook_id`
- `invitation_rsvp_responses` → many-to-one via `rsvp_id`
- `invitation_transportation` → 1:1 via `location_id`
- `uploaded_files` → tracks all R2 uploads for the invitation

`loadAdminData()` in `data.ts` fetches everything in parallel with `Promise.all` and returns a flat `AdminDashboardData` object. The public page uses `loadInvitationView()` in `invitationData.ts`, which transforms the DB rows (snake_case) into the `InvitationMock` shape (camelCase) used by all public components.

## File Storage

Images and audio are stored on **Cloudflare R2** (S3-compatible). Uploads go through `POST /api/admin/upload`, which compresses images over 2 MB server-side using Sharp before uploading. The R2 upload flow uses a temp path then copies to the final path. File metadata is tracked in the `uploaded_files` table.

Browser-side image compression (`src/lib/clientImageCompression.ts`) is also available as a pre-upload step via canvas.

## Auth

JWT-based with HS256. Access tokens live in `admin_access_token` (httpOnly cookie, 15 min TTL). Refresh tokens in `admin_refresh_token` (12 hr TTL, hashed with SHA-256 before DB storage). The refresh flow is handled by `GET /api/admin/refresh`. All auth utilities are in `src/lib/adminAuth.ts`.

Admin passwords are bcrypt-hashed and stored in Supabase. Use `pnpm hash-password` to generate hashes.

## Theming

CSS custom properties in `globals.css` define the public design system (colors, shadows, radii, fonts). These are **overridable at runtime** — the root layout reads theme values from the `invitation_theme` DB table and injects them as inline style variables on `<html>`. This means all `var(--accent-rose)`, `var(--bg-primary)`, etc. can be customized per invitation via the admin theme editor.

The admin panel uses a separate font scope (`.admin-scope`, `.admin-font-scope`) to isolate its UI from the public theme fonts. The admin button/dialog styling is also scoped via `.admin-scope` and `.admin-dialog` CSS layers to avoid inheriting the public serif typography.

## Tailwind

Tailwind CSS v4 with PostCSS. No `tailwind.config.*` file — configuration is done via `@theme` and `@source` directives in `globals.css`. The `prettier-plugin-tailwindcss` plugin is active (configured in `.prettierrc`).

## Key Conventions

- **Server vs Client boundary**: Server components fetch data; client components receive it as props. The only client entry points are `PublicPageClient` (public page) and `AdminDashboard` / `AdminContentRouter` (admin). Don't add `'use client'` to files that don't need interactivity.
- **Server actions**: All admin mutations are `'use server'` actions in `actions/`. They follow the pattern: `requireAdminSession()` → mutate Supabase → `revalidateAdmin()`.
- **`cn()` utility**: `src/lib/utils.ts` exports `cn` (clsx + tailwind-merge) for conditional class composition. Use it everywhere.
- **Mock fallback**: `src/mock/invitation.mock.ts` defines the canonical `InvitationMock` type and mock data. It serves as both the type source and a fallback when the DB is empty.
- **ISR revalidation**: The public page and root layout use `revalidateInterval: 60` (60 s). Admin actions call `revalidateAdmin()` / `revalidatePublic()` (from `next/cache`) after writes to push changes immediately.
- **Unused directories**: Several directories under `(admin)/admin/content/` and `(admin)/admin/guests/` with curly-brace names (`{basic,gallery,...}`) are scaffolding — no page files inside. The admin dashboard does not use file-based routing for its sections.
