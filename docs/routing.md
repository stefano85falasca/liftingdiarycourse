# Routing

## Route Structure

All application routes live under `/dashboard`. The root `/` page is not part of the authenticated app.

```
/dashboard                          # User's workout diary (home)
/dashboard/workout/new              # Create a new workout
/dashboard/workout/[workoutId]      # Edit an existing workout
```

## Route Protection

All `/dashboard` routes and sub-routes are protected and require the user to be authenticated.

Route protection is enforced via Next.js middleware using Clerk's `clerkMiddleware`. The middleware must protect the `/dashboard` path and all routes beneath it, redirecting unauthenticated users to `/sign-in`.

**middleware.ts** must use `clerkMiddleware` with route protection applied to `/dashboard(.*)`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

Do not duplicate auth checks inside individual page components when middleware already protects the route. See `docs/auth.md` for auth patterns within server components and server actions.

## Dynamic Routes

Dynamic route segments use the Next.js `[param]` convention. Always validate dynamic params before use:

- Verify the param is a valid value (e.g. a number for IDs)
- Verify the resource belongs to the authenticated user
- Call `notFound()` if either check fails

## Adding New Routes

- All new pages must be placed under `app/dashboard/`
- New routes are automatically protected by middleware — no per-page auth redirect needed
- Server actions associated with a route live in an `actions.ts` file co-located with the page
