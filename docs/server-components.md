# Server Components

## Overview

This project uses Next.js 15 with the App Router. All page and layout components are React Server Components by default unless marked with `"use client"`.

## Accessing `params` and `searchParams`

In Next.js 15, `params` and `searchParams` are **Promises** and must be `await`ed before accessing their values.

```typescript
// ✅ Correct
interface Props {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { workoutId } = await params;
  const { date } = await searchParams;
}
```

```typescript
// ❌ Wrong — do not destructure directly without awaiting
export default async function Page({ params }: { params: { workoutId: string } }) {
  const { workoutId } = params; // runtime error in Next.js 15
}
```

## Data Fetching

- All data fetching must happen in Server Components — never in client components or route handlers.
- Use helpers from the `src/data/` directory (Drizzle ORM).
- Every query must filter by `userId` from the Clerk session.

## Authentication

- Call `auth()` from `@clerk/nextjs/server` at the top of every protected page.
- Redirect unauthenticated users to `/sign-in` using `redirect()`.
- Never accept `userId` from URL params or request bodies.

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  // ...
}
```

## `notFound()`

Use `notFound()` from `next/navigation` when a resource does not exist or does not belong to the authenticated user.
