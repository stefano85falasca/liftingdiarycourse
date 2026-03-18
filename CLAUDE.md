# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 app using the App Router (`app/` directory), React 19, TypeScript, and Tailwind CSS v4.

- `app/layout.tsx` — root layout with font and global metadata
- `app/page.tsx` — home page entry point
- `app/globals.css` — global styles (Tailwind base)

No test framework is configured yet.

## Documentation

IMPORTANT: Before generating any code or making any other change, always consult the relevant documentation files in the `docs/` directory first. Use these docs as the primary reference for implementation patterns, conventions, and decisions specific to this project.

- `docs/auth.md` — Authentication patterns, middleware setup with Clerk, and auth checks in server components and actions
- `docs/data-fetching.md` — Data fetching patterns and conventions
- `docs/data-mutations.md` — Data mutation patterns and server action conventions
- `docs/routing.md` — Route structure, route protection, dynamic routes, and guidelines for adding new routes
- `docs/server-components.md` — Server component patterns and best practices
- `docs/ui.md` — UI component patterns and styling conventions
- `docs/version-control.md` — Git workflow, commit message standards, and branching conventions

## Commit Messages

Follow `docs/version-control.md` for all commit message standards.

**IMPORTANT:** Never append `Co-Authored-By` trailers or any AI/tool attribution to commit messages.
