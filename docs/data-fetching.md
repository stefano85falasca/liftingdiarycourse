# Data Fetching

## Rules

### Server Components Only

ALL data fetching MUST be done via React Server Components.

- NEVER fetch data in route handlers (API routes)
- NEVER fetch data in client components (`"use client"`)
- NEVER use `useEffect` + `fetch` or SWR/React Query for data fetching
- NEVER call database helpers from client-side code

Server components can be async and should query the database directly by calling helper functions from the `data/` directory.

### Data Helpers

All database queries MUST be implemented as helper functions inside the `data/` directory.

- One file per domain entity (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Helpers MUST use Drizzle ORM — NEVER write raw SQL
- Helpers are called only from server components

Example structure:

```
data/
  workouts.ts
  exercises.ts
  sets.ts
```

Example helper:

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Data Isolation — CRITICAL

A logged-in user MUST only ever be able to access their own data.

- Every query MUST filter by the authenticated user's ID
- The `userId` MUST be obtained server-side from the auth session (Clerk), never from request params or client input
- NEVER accept a `userId` as a URL parameter or request body field and use it directly in a query
- NEVER return data without scoping it to the current user

Example of correct usage in a server component:

```tsx
// app/workouts/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function WorkoutsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```
