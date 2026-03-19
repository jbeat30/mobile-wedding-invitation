# Admin CMS — Local Rules

Supplements root `CLAUDE.md`. Apply when working in `src/app/(admin)/`.

## Component Patterns

- **AdminForm**: wraps `<form action={serverAction}>`. Never use `onSubmit` — all mutations are server actions.
- **Field components**: `AdminImageFileField`, `AdminGalleryUploadField`, `AdminSwitchField`, `AdminSelectField` — use these, don't build ad-hoc inputs.
- **AdminSubmitButton**: always use this for form submit buttons (handles pending state).

## Section Components

- Named `AdminSection{Name}.tsx` under `components/sections/`.
- Dynamically imported by `AdminContentRouter` — match `activeTab` key exactly.
- Do **not** add new Next.js page routes for admin sections. Client-side tab switching only.

## Mutations (Server Actions)

Pattern: `requireAdminSession()` → mutate Supabase → `revalidateAdmin()` / `revalidatePublic()`

```ts
// actions/*.ts
'use server'
export async function updateFoo(data: FormData) {
  await requireAdminSession()
  await supabaseAdmin.from('invitation_foo').update(...)
  revalidateAdmin()
  revalidatePublic()
}
```

Never call `revalidatePath` directly — use the helpers in `lib/revalidate.ts`.

## Zustand Store (adminStore.ts)

Uses immer middleware. Mutations must use the draft pattern:

```ts
// correct
set(draft => { draft.activeTab = 'gallery' })

// wrong — do not replace state object
set({ activeTab: 'gallery' })
```

## CSS Scoping

Admin UI must stay inside `.admin-scope` — prevents public serif fonts leaking in.
Dialog styles use `.admin-dialog` layer. Never add global styles from admin components.
