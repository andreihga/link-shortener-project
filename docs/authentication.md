# Authentication

All authentication and authorization is handled by Clerk (`@clerk/nextjs`). No other auth method (custom sessions, JWTs, NextAuth, cookies, passwords, other providers) may be added.

## Rules

- Identity comes only from Clerk on the server: `await auth()` or `await auth.protect()` from `@clerk/nextjs/server`. Never accept a `userId` from the client.
- `proxy.ts` stays a bare `clerkMiddleware()`. Protection happens at the point of use, not in middleware.
- Any component that calls `auth()` must sit under a `<Suspense>` boundary (`cacheComponents` is enabled).
- Use `<Show when="signed-in">` / `<Show when="signed-out">` for conditional UI. Do not use `<SignedIn>` / `<SignedOut>`.
- Client components use Clerk hooks for UI only, never for authorization.

## Route Access

| Route | Access | Behavior |
|---|---|---|
| `/dashboard` (and everything under it) | Protected | Requires sign-in. Call `await auth.protect()` in the page or layout. |
| `/` (home) | Public, signed-out only | Signed-in users are redirected to `/dashboard`. |
| `/{slug}` short-link redirect | Public | No auth required. |

New pages under `/dashboard` inherit the protected requirement; call `auth.protect()` in each page or in the `/dashboard` layout.

## Protected Page

```tsx
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const { userId } = await auth.protect();
  // fetch via data/ helpers using userId
}
```

## Home Page Redirect

Signed-in users must never see the home page. Redirect on the server, not in `proxy.ts` and not on the client.

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  // render the marketing / landing content
}
```

## Sign In and Sign Up

Sign in and sign up always open as a modal. Always pass `mode="modal"`:

```tsx
<SignInButton mode="modal">
  <Button variant="ghost">Sign in</Button>
</SignInButton>
<SignUpButton mode="modal">
  <Button>Sign up</Button>
</SignUpButton>
```

- Never link to or navigate users to a full-page sign-in/sign-up flow from the UI.
- Any call-to-action that requires an account (for example "Get started") uses `SignUpButton mode="modal"`.
- Wrap the buttons in `<Show when="signed-out">`; show `<UserButton />` inside `<Show when="signed-in">`.

## Server Actions and Route Handlers

- Check `auth()` first. Return 401 when `userId` is null.
- Scope every query and mutation to the authenticated `userId` (see `database.md`).
- When a resource belongs to another user, respond as if it does not exist.

## Anti-Patterns

- Adding any non-Clerk auth mechanism.
- Adding `createRouteMatcher` or route protection to `proxy.ts`.
- Rendering `SignInButton` / `SignUpButton` without `mode="modal"`.
- Redirecting signed-in users from the home page on the client or in middleware.
- Trusting a `userId`, role, or owner ID from the client.
- Reading `auth()` outside a `<Suspense>` boundary.
