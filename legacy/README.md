# legacy/

Archived, unreachable code kept for reference.

- `medlem/kurser/**` — the member "courses" pages. They were disabled in the app
  (each page began with `return notFound()` and the nav entry was removed from
  `lib/menu.ts`).
- `api/member/course/**` — the API routes those pages used.
- `components/CourseForm.*` — the form those pages used.

These are no longer part of the Next.js app and are excluded from
`tsconfig.json` and ESLint. `lib/controllers/course.ts` is **not** archived:
`signUp` is still used by the public `/api/sign-up-to-course` route.
