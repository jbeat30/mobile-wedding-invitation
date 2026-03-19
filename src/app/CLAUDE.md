# Public Page — Local Rules

Supplements root `CLAUDE.md`. Apply when working in `src/app/page.tsx` or `src/app/PublicPageClient.tsx` and public section components.

## Client Entry Point

`PublicPageClient.tsx` is the **only** client entry point for the public page. Do not add `'use client'` to section components or sub-components — pass everything as props from PublicPageClient.

## Section Render Order

Couple → WeddingInfo → Location → Gallery → Accounts → Guestbook → RSVP → Share → Closing

## Animation (GSAP + ScrollTrigger)

Declare via `data-animate` attribute — never call GSAP directly in section components.

| Attribute | Effect |
|-----------|--------|
| `data-animate="fade-up"` | Default — fade in + translate Y |
| `data-animate="fade"` | Opacity only |
| `data-animate="scale"` | Scale up |
| `data-animate="stagger"` | Animates children marked with `data-animate-item` |

**Do not use:**
- `invalidateOnRefresh: true` — causes opacity flash on scroll
- `createRadialGradient` per frame — use pre-computed fill strings

## CherryBlossomCanvas

The second canvas (`fullHeight=true`) must only wrap **Couple + WeddingInfo + Location** (~1200px). Do not extend it to cover Gallery or later sections — causes GPU overload on large buffers.

## ResizeObserver / ScrollTrigger.refresh()

Only call `ScrollTrigger.refresh()` on WIDTH changes. Ignore height-only changes (images loading, sections mounting) to avoid cascade.

## Dynamic Imports

Heavy sections use `next/dynamic` with `ssr: true`. Keep `ssr: true` — these sections have server-rendered content. Only disable for browser-only APIs.
