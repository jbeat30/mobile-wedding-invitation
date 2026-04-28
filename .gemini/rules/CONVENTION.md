# Mobile Wedding Invitation - Project Conventions

- This document defines repository-specific rules for `mobile-wedding-invitation`.
- Follow the shared rules in `AGENTS.md` and `.claude/rules/GENERIC_CONVENTION.md` first. When this document is more specific, this document takes precedence.
- This repository is a mobile-first invitation product with two connected surfaces: the public invitation page and the admin CMS. Changes must preserve both the guest-facing experience and the admin editing flow.

## 1. Project Nature

- This is not a generic marketing site. It is a data-driven invitation app backed by Supabase and edited through an internal admin CMS.
- The main decision criteria are preserving rendering order, editing traceability, cache invalidation correctness, and stable external integrations.
- Public invitation content, admin editing forms, uploaded assets, theme variables, guestbook entries, RSVP entries, and admin authentication must all be treated as connected operational flows rather than isolated UI pieces.

## 2. Priority Reference Documents

- Check `CLAUDE.md` first for repository-wide architecture and command references.
- Check `src/app/CLAUDE.md` before changing the public invitation page, `PublicPageClient.tsx`, section order, GSAP behavior, or blossom canvas behavior.
- Check `src/app/(admin)/CLAUDE.md` before changing admin forms, admin sections, server actions, or admin styling scope.
- Do not infer behavior from one component alone when a local rule document already defines the intended flow.

## 3. Repository Structure Interpretation

- `src/app/page.tsx` is the server entry for the public invitation.
- `src/app/PublicPageClient.tsx` is the only public client entry point and owns client-only concerns such as BGM, GSAP, security guards, and client fetch of full invitation data.
- `src/components/sections/` contains public invitation sections. These are presentation-oriented and prop-driven.
- `src/app/(admin)/admin/` contains the admin dashboard page, admin server actions, and admin-specific client composition.
- `src/stores/adminStore.ts` is the single global UI state store for the admin surface.
- `src/app/invitationData.ts` maps Supabase rows into the public `InvitationMock` shape.
- `src/app/(admin)/admin/data.ts` loads and normalizes admin dashboard data.
- `src/lib/` contains server-side infrastructure and shared helpers such as Supabase, auth, cache, R2, and compression.
- `src/mock/invitation.mock.ts` is the canonical public data shape and fallback source when DB data is missing or loading fails.

## 4. Public Invitation Rules

### 4.1 Data Loading Flow

- Preserve the current split loading model:
  - `page.tsx` loads only the minimum loading-section payload on the server.
  - `PublicPageClient` fetches full invitation data from `/api/invitation` after the loading phase.
- Do not collapse this into a single all-in-one fetch without clear reason. The current design exists to reduce initial payload and protect TTFB.
- Keep the public ISR cadence aligned with the current `revalidate = 60` behavior unless the task explicitly changes cache policy.

### 4.2 Client Boundary

- `PublicPageClient.tsx` is the only public page file that should own `'use client'` level orchestration.
- Do not add ad-hoc client boundaries to public section components unless interactivity cannot be expressed through props.
- Prefer passing already-normalized data into sections instead of making sections fetch, mutate global state, or depend on browser-only APIs directly.

### 4.3 Section Order and Composition

- Preserve the current section render order unless the request explicitly changes user-facing composition:
  - Couple -> WeddingInfo -> Location -> Gallery -> Accounts -> Guestbook -> RSVP -> Share -> Closing
- Loading, blossom canvas, BGM player/toggle, and intro/greeting flow are part of the page composition contract and should not be rearranged casually.

### 4.4 Animation and Performance

- Public sections must declare animation intent through `data-animate` attributes. Do not wire GSAP logic directly inside section components.
- Preserve the current supported animation contract: `fade-up`, `fade`, `scale`, `stagger`, and child marker `data-animate-item`.
- Keep browser-only heavy features dynamically imported in `PublicPageClient`.
- Preserve the width-change-only refresh policy around `ScrollTrigger.refresh()` and avoid reintroducing height-based refresh cascades.
- Keep the full-height `CherryBlossomCanvas` limited to the currently intended early-page section range. Do not expand it across the full document without explicit performance review.

### 4.5 Content Protection and Device Behavior

- Public page copy/drag/context-menu/shortcut guards in `PublicPageClient` are intentional. Do not weaken or remove them without an explicit request.
- Mobile-first behavior matters. Features such as safe-area handling, touch behavior, and navigation app launching logic must be reviewed as mobile UX, not desktop-only UI.

## 5. Admin CMS Rules

### 5.1 Surface Structure

- The admin CMS is a single dashboard surface under `/admin`, not a multi-page CRUD app.
- Preserve the current client-side tab routing model driven by `useAdminStore().activeTab` and `AdminContentRouter`.
- Do not introduce new admin page routes for section switching when the existing tab model is sufficient.

### 5.2 Mutation Pattern

- Admin writes must follow the established sequence:
  - `requireAdminSession()`
  - mutate through `createSupabaseAdmin()`
  - `revalidateAdmin()`
  - `revalidatePublic()` when the public invitation output changes
- Do not bypass this flow with ad-hoc fetch handlers, client-side direct writes, or raw `revalidatePath` calls from unrelated locations.

### 5.3 Form and Component Conventions

- Admin mutations are form-based server actions. Prefer `<form action={serverAction}>` through the existing admin form components.
- Reuse admin-specific field components such as `AdminImageFileField`, `AdminGalleryUploadField`, `AdminSwitchField`, `AdminSelectField`, and `AdminSubmitButton` instead of rebuilding divergent inputs.
- Keep admin UI inside `.admin-scope` and modal/dialog UI inside the existing admin dialog scope. Do not leak admin styles into public globals.

### 5.4 Admin State Management

- `src/stores/adminStore.ts` is the only global admin store. Preserve Zustand + `immer` draft mutation style.
- Do not replace the store with local duplicated state for cross-section concerns such as active tab, gallery drag state, modal state, or place-search state.
- Keep TanStack Query responsible for admin data fetching/hydration and keep Zustand responsible for admin UI state and synchronized derived editing state.

## 6. Data, Mapping, and Fallback Rules

### 6.1 Supabase as Source of Truth

- Treat Supabase tables as the source of truth for persisted invitation content, admin users, refresh tokens, uploads, guestbook entries, and RSVP responses.
- Preserve the current table relationship interpretation:
  - most `invitation_*` tables are effectively one row per invitation
  - gallery images, account entries, guestbook entries, RSVP responses, and uploaded files are multi-row collections

### 6.2 Mapping Boundary

- Preserve the current boundary between DB `snake_case` rows and public `camelCase` view models.
- `invitationData.ts` and admin data loaders are the correct places for normalization and fallback assembly.
- Do not spread raw DB field shapes throughout public section components.

### 6.3 Missing Data Strategy

- The project intentionally falls back to `invitationMock` or mock-derived defaults when DB rows are missing or some reads fail.
- Do not remove fallback behavior casually. If a change makes fallback stricter, document the operational impact clearly.
- Keep the single-row bootstrap behavior (`ensureSingleRow`, `getOrCreateInvitation`, cached invitation/theme loaders) intact unless the data model itself is being redesigned.

## 7. Auth, Security, and Sensitive Flows

- `/admin` protection depends on JWT cookies, middleware routing, and refresh-token rotation. Treat these as security-sensitive flows.
- Do not change access token / refresh token cookie names, token rotation logic, refresh thresholds, or login redirect behavior without explicit requirement.
- Refresh tokens are hashed before persistence. Do not store raw refresh tokens in DB or logs.
- Keep service-role Supabase usage server-only. Do not move `createSupabaseAdmin()` into client-executed code.
- Preserve defensive validation for public write APIs such as guestbook and RSVP. External input must remain trimmed, length-limited, and format-checked.

## 8. External Integration Rules

- Kakao SDK sharing and Kakao Map loading are external integration contracts. Preserve lazy loading, initialization checks, and graceful failure UI.
- Navigation app launching logic in the location section is part of the guest mobile flow. Do not simplify it into generic link behavior without checking fallback behavior for Android and iOS.
- Cloudflare R2 upload behavior, file-type checks, image compression, and uploaded file metadata recording are part of a single asset pipeline. Do not partially change one step without reviewing the full flow.

## 9. Styling and Theme Rules

- Public design tokens are controlled through CSS custom properties in `src/app/globals.css` and runtime theme injection in `src/app/layout.tsx`.
- Prefer `var(--...)` theme tokens over hard-coded colors, shadows, or radii for public UI.
- Preserve the separation between public theme scope and admin scope.
- Tailwind CSS v4 is configured through `@theme` and `@source` in `globals.css`; do not assume a legacy `tailwind.config.*` flow exists.
- When editing styles, respect the existing mobile-first layout constraints such as `max-w-[520px]`, safe-area variables, and invitation-specific typography choices.

## 10. Validation and Review Priorities

- Check first whether the public invitation still renders in the same order and with the same visible behavior for guests.
- Check first whether admin edits still propagate correctly through server actions, Supabase writes, and cache revalidation.
- Review changes for regression risk across:
  - loading screen and full invitation fetch split
  - theme variable injection
  - guestbook / RSVP public submission APIs
  - admin auth and token refresh
  - gallery ordering and uploaded asset handling
  - Kakao share / map integrations
- Verify type, lint, build, and runtime impact only within the range actually executed, and report unvalidated areas explicitly.

## 11. Prohibited Actions

- Do not turn public section components into independent data-fetching clients without clear need.
- Do not bypass admin server actions with direct client writes to Supabase.
- Do not remove public mock fallback behavior merely to make the code look stricter.
- Do not replace the current single-dashboard admin navigation model with route-heavy structure without an explicit request.
- Do not hard-code public theme values in component markup when an existing CSS variable already expresses the design token.
- Do not weaken input validation, auth checks, upload restrictions, or content-protection guards without explicit justification.
