# Data Mutations

## Rules

### Data Helpers in `data/`

ALL data mutations MUST be implemented as helper functions inside the `data/` directory. These helpers wrap Drizzle ORM calls and are the single place where database writes happen.

- One file per domain entity (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Helpers MUST use Drizzle ORM — NEVER write raw SQL
- NEVER call `db` directly from server actions, components, or anywhere outside the `data/` directory

Example mutation helper:

```ts
// src/data/workouts.ts
import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(userId: string, name: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ clerkUserId: userId, name, startedAt: new Date() })
    .returning();
  return workout;
}

export async function deleteWorkout(userId: string, workoutId: number) {
  await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.clerkUserId, userId));
}
```

### Server Actions in Co-located `actions.ts` Files

ALL data mutations triggered from the UI MUST be done via Next.js Server Actions. Server actions MUST live in a file named `actions.ts` co-located with the route or component that uses them.

- NEVER mutate data in route handlers (API routes)
- NEVER mutate data directly inside client components
- NEVER define server actions in component files — always use a dedicated `actions.ts`

Example structure:

```
app/
  dashboard/
    page.tsx
    actions.ts       <-- server actions for the dashboard route
  workouts/
    [id]/
      page.tsx
      actions.ts     <-- server actions for the workout detail route
```

### Typed Params — No FormData

All server action parameters MUST be explicitly typed with TypeScript types or interfaces. `FormData` MUST NOT be used as a parameter type.

- Define a plain object type for each action's input
- This keeps actions easy to call programmatically and easy to validate with Zod

```ts
// WRONG
export async function createWorkoutAction(data: FormData) { ... }

// CORRECT
export async function createWorkoutAction(params: { name: string }) { ... }
```

### Zod Validation

ALL server actions MUST validate their arguments with Zod before doing any processing or calling data helpers.

- Define a Zod schema that mirrors the action's param type
- Call `.parse()` or `.safeParse()` at the top of the action body, before any other logic
- If validation fails, return a typed error response — do not throw unhandled exceptions

Install Zod if not already present:

```bash
npm install zod
```

### No Redirects in Server Actions

NEVER call `redirect()` from a server action. Redirects must be handled client-side based on the action's return value.

- Server actions MUST return a typed result (success or error)
- The calling client component is responsible for navigating based on the result (e.g. using `useRouter`)

```ts
// WRONG
export async function createWorkoutAction(params: { name: string }) {
  const workout = await createWorkout(userId, params.name);
  redirect("/dashboard"); // ❌ never redirect from a server action
}

// CORRECT — return a result; let the client redirect
export async function createWorkoutAction(params: { name: string }) {
  const workout = await createWorkout(userId, params.name);
  return { workout }; // ✅ client decides what to do next
}
```

Full example of a correctly structured server action:

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/src/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function createWorkoutAction(params: { name: string }) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated" };

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workout = await createWorkout(userId, parsed.data.name);
  return { workout };
}
```

### Data Isolation — CRITICAL

The same rule from data fetching applies to mutations: a user MUST only ever be able to mutate their own data.

- The `userId` MUST always be obtained server-side from the Clerk auth session inside the server action
- NEVER accept a `userId` as a parameter passed in from the client
- ALL mutation helpers MUST scope the operation to the authenticated user's ID

```ts
// WRONG — trusting a userId from the client
export async function deleteWorkoutAction(params: { userId: string; workoutId: number }) {
  await deleteWorkout(params.userId, params.workoutId);
}

// CORRECT — userId comes from the server-side session
export async function deleteWorkoutAction(params: { workoutId: number }) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated" };

  const parsed = z.object({ workoutId: z.number().int().positive() }).safeParse(params);
  if (!parsed.success) return { error: "Invalid input" };

  await deleteWorkout(userId, parsed.data.workoutId);
  return { success: true };
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Database writes | Only via helpers in `data/` using Drizzle ORM |
| Triggering mutations | Only via server actions in co-located `actions.ts` files |
| Action params | Explicitly typed — never `FormData` |
| Validation | Zod schema checked at the top of every server action |
| User scoping | `userId` from Clerk session only, never from client input |
| Redirects | Never from server actions — return a result and redirect client-side |
