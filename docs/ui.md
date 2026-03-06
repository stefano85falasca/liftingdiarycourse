# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components.
- Do NOT use raw HTML elements for UI (buttons, inputs, cards, etc.) when a shadcn/ui equivalent exists.
- Do NOT use any other component library (MUI, Chakra, Radix primitives directly, etc.).
- All shadcn/ui components live in `components/ui/` and are imported from there.

If a shadcn/ui component does not exist for a given need, compose existing shadcn/ui components together rather than building something from scratch.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

### Format

Dates are displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the `do MMM yyyy` format string with `format` from date-fns:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

Never use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting method.
