---
name: rapid-frontend-development
description: Accelerate high-fidelity frontend delivery during time-constrained hackathons by leveraging established design systems, modular features, and iterative user journeys.
---

# Rapid Frontend Development Guide

During an 8-hour hackathon, engineering velocity depends on discipline: composing existing UI building blocks, sticking to the primary user journey, and avoiding distraction from non-essential features.

## Execution Rules

1. **User Journey First**:
   - Focus 100% of initial development on the primary happy path and core problem flow.
   - Defer secondary settings, onboarding tours, profile management, and aesthetic micro-tweaks until the core flow is fully functional and tested.

2. **Reuse the UI Primitives**:
   - Build screens exclusively by composing components from `src/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Alert`, `Skeleton`).
   - Do not write repetitive ad-hoc styling; rely on the design tokens and Tailwind utility conventions documented in `DESIGN.md`.

3. **Complete State Coverage**:
   Every interactive screen must handle all 5 standard UI states:
   - **Initial / Empty**: Clear call-to-action explaining what to do.
   - **Loading / Pending**: Visible indicators (`Skeleton` or spinner) with disabled action triggers.
   - **Success / Data**: Clear, high-contrast, structured presentation of results.
   - **Validation Error**: Inline form feedback highlighting required fields or format issues.
   - **Network Error**: Explanatory message with an explicit retry action.

4. **Modular Feature Scaffolding**:
   - Place challenge-specific screens in a dedicated feature folder (e.g., `src/features/<challenge-name>/`).
   - Keep business state in custom React hooks (e.g., `useChallengeAction.ts`) to maintain clean separation between presentation and data fetching.

5. **Iterative Verification**:
   - Keep pull changes atomic and small enough to test immediately in the browser.
   - Run type checks (`npm run build` or `npx tsc --noEmit`) after every major feature addition.
