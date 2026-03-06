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
