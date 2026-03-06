# Authentication

This app uses [Clerk](https://clerk.com) for authentication.

## Setup

`ClerkProvider` wraps the entire app in `app/layout.tsx`. The middleware is configured in `middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`.

## Protecting Routes

Routes are protected at the page level, not the middleware level. The middleware runs on all requests (enabling Clerk's session context everywhere), but individual pages are responsible for checking authentication and redirecting if needed.

**Do not** rely on middleware-level route protection. Always check `userId` at the top of every protected server component.

```ts
// middleware.ts — runs on all routes, does not redirect
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

## Accessing the Current User

### Server Components

Use `auth()` from `@clerk/nextjs/server`. It is async and must be awaited.

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // userId is a string — use it to scope all data queries
}
```

Always redirect to `/sign-in` if `userId` is `null`. Never render protected content without this check.

### Client Components

Use the `useAuth` hook from `@clerk/nextjs`. Only use this for UI-level concerns (e.g., showing/hiding elements). Never use client-side auth to gate data access — data must be fetched server-side.

```tsx
"use client";

import { useAuth } from "@clerk/nextjs";

export function SomeClientComponent() {
  const { userId, isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  // render signed-in UI
}
```

### Server Actions

Use `auth()` from `@clerk/nextjs/server`, same as server components. Validate `userId` at the top of every action before doing anything.

```ts
"use server";

import { auth } from "@clerk/nextjs/server";

export async function someAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // proceed with userId
}
```

## UI Components

Clerk UI components are imported from `@clerk/nextjs` (no `/server`). The layout uses `Show`, `SignInButton`, `SignUpButton`, and `UserButton` for the auth header:

```tsx
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
```

Use `Show when="signed-in"` and `Show when="signed-out"` to conditionally render UI based on auth state.

## Database — User ID Convention

The Clerk user ID is stored in the database as `clerk_user_id` (a `varchar(255)` column). The Drizzle schema field name is `clerkUserId`.

Always filter queries by `clerkUserId` to scope data to the authenticated user. See `docs/data-fetching.md` for the full data isolation rules.

## Conventions

- Import `auth` from `@clerk/nextjs/server` — not from `@clerk/nextjs`
- Import UI components (`UserButton`, `SignInButton`, etc.) from `@clerk/nextjs`
- `userId` from Clerk is always a `string` — treat it as an opaque identifier
- Never accept a `userId` from URL params, query strings, or request bodies — always derive it from the Clerk session
- Redirect unauthenticated users to `/sign-in`
