---
name: stitch-design-implementation
description: Inspect and convert Google Stitch design projects, tokens, screens, and assets into production-ready React components with responsive layouts.
---

# Stitch Design Implementation Guide

This skill governs the translation of visual designs and specifications from Google Stitch into clean, maintainable, responsive React components in Antigravity.

## Core Principles

1. **Stitch as Source of Truth**: Treat the connected Stitch project's screens, layout hierarchy, color palettes, and typographic tokens as the definitive visual guide.
2. **Component Abstraction over Markup Duplication**: Do not copy-paste monolithic raw HTML blocks from Stitch. Deconstruct screens into atomic, reusable UI primitives (`Button`, `Card`, `Badge`, `Input`, `Dialog`, etc.).
3. **Responsive by Design**: Ensure designs work across mobile (<640px), tablet (640px–1024px), and desktop (>1024px) viewports using Tailwind CSS utility classes.
4. **Honest Fallbacks**: If Stitch is unreachable or has no screens, follow the established neutral, high-contrast design system defined in `DESIGN.md`. Never fabricate design tokens or claim non-existent assets came from Stitch.

---

## Step-by-Step Workflow

### 1. Discover and Inspect Stitch Projects
Call the Stitch MCP tools to discover available projects and screens:
- `list_projects`: Identify the current or relevant project ID.
- `list_screens`: Retrieve all screens in the target project.
- `get_screen`: Fetch metadata, screenshot URLs, layout dimensions, and extracted code/tokens.

### 2. Extract and Document Design Tokens
Record all extracted design tokens into `DESIGN.md`:
- **Colors**: Primary brand color, secondary accent, neutrals (background, surface, border, muted text, foreground text), and semantic states (success, warning, error, info).
- **Typography**: Font family (e.g., Inter, system sans), scale (xs, sm, base, lg, xl, 2xl, 3xl), line-heights, and font weights.
- **Elevation & Radius**: Border radii (`rounded-md`, `rounded-xl`), shadows, and border stroke widths.
- **Spacing Scale**: Spacing cadence (4px, 8px, 12px, 16px, 24px, 32px).

### 3. Build Reusable Components
Map Stitch design components to modular React components in `src/components/ui/`:
- Keep presentation decoupled from application logic.
- Ensure all interactive states (hover, active, focus-visible, disabled, loading) match the design specs.
- Use accessible HTML elements and ARIA attributes (`aria-disabled`, `aria-busy`, etc.).

### 4. Visual Comparison and Polish
After implementing components:
- Compare rendered UI with Stitch screenshot URLs or design assets.
- Verify typography hierarchy, contrast ratios, and whitespace balance.
- Remove visual clutter: avoid gratuitous gradients, unreadable low-contrast text, or unnecessary decorative animations.
