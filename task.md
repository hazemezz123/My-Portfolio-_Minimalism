Act as a senior UI engineer and accessibility specialist.

PROJECT CONTEXT
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Class-based dark mode already implemented
- Minimalist engineering portfolio

PROBLEM
After adding dark mode, the website has multiple contrast issues:
- Low readability in dark mode
- Muted text too faint
- Borders barely visible
- Cards blending into background
- Poor focus visibility
- Inconsistent color usage across components

GOAL
Refactor the entire color system to fix contrast issues properly — not by random tweaks, but by enforcing a consistent token-based color architecture that guarantees readability and visual hierarchy.

CONSTRAINTS
- Keep Tailwind
- No UI libraries
- No redesign of layout
- No gradients
- No glow effects
- Maintain minimalist aesthetic
- Preserve performance

REFACTOR STRATEGY (MANDATORY)

1) CREATE A STRICT COLOR SYSTEM

Define semantic tokens instead of raw neutral classes.

Light Mode:
- --bg
- --surface
- --text
- --muted
- --border

Dark Mode:
- --bg
- --surface
- --text
- --muted
- --border

Dark mode rules:
- No pure black (#000)
- Use neutral-950 for background
- Surface must be lighter than bg (neutral-900)
- Body text must be neutral-100
- Muted text must not be below neutral-400
- Borders must be neutral-800

2) IMPLEMENT CSS VARIABLES IN globals.css

Define tokens under:
:root {}
.dark {}

Then refactor components to use:
- bg-[var(--bg)]
- text-[var(--text)]
- border-[var(--border)]
- etc.

3) REMOVE LOW-CONTRAST UTILITIES

Search and replace:
- dark:text-neutral-500 → dark:text-neutral-300 or 400
- dark:border-neutral-700 → dark:border-neutral-800
- dark:bg-neutral-950 (for cards) → dark:bg-neutral-900
- Very faint placeholder colors → increase contrast

4) FIX SURFACE HIERARCHY

Page background:
- bg-[var(--bg)]

Cards:
- bg-[var(--surface)]
- border-[var(--border)]

Ensure clear separation between layers.

5) FIX INTERACTIVE ELEMENTS

Buttons:
- Primary:
  - Light: bg-neutral-900 text-white
  - Dark: bg-neutral-100 text-neutral-950
- Secondary:
  - Light: border-neutral-300 text-neutral-900
  - Dark: border-neutral-700 text-neutral-100

Links:
- High contrast
- Underline on hover
- No faded link colors

6) FIX FOCUS STATES

Add visible focus ring:
- focus-visible:ring-2
- Proper contrast in both themes
- Correct ring-offset colors for light and dark

7) AUDIT THESE COMPONENTS

- Navbar
- Footer
- Project Cards
- Tags
- Buttons
- Forms
- Inputs
- Placeholder text
- Disabled states
- Dividers
- Timeline items

8) ACCESSIBILITY REQUIREMENT

Ensure:
- Body text is clearly readable
- Muted text remains readable
- Buttons have strong contrast
- Form labels are readable in dark mode
- WCAG AA compliance for primary text

OUTPUT FORMAT (STRICT)

1) Root cause analysis (why contrast failed)
2) Updated globals.css with tokens
3) Updated Tailwind config (if needed)
4) Refactored sample components:
   - Layout
   - Card
   - Button
   - Input
5) List of classes replaced (before → after)
6) Final color token summary table

Do not redesign the UI.
Do not add visual effects.
Do not overcomplicate.

The result must feel clean, balanced, readable, and professional.
