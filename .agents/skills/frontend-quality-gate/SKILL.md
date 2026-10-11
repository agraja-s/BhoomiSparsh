---
name: frontend-quality-gate
description: Run automated audits, typechecks, component tests, responsive evaluations, and presentation checks prior to demoing or submitting hackathon projects.
---

# Frontend Quality Gate Guide

Before presenting to judges or declaring any hackathon task complete, execute this standardized quality gate to ensure stability, polish, and zero demo failures.

## 10-Point Pre-Submission Audit

1. **Type Safety & Build Verification**:
   - Run `npm run build` in `frontend/`.
   - Ensure zero TypeScript compiler errors (`tsc --noEmit`).

2. **Automated Unit & Integration Tests**:
   - Run `npm run test` (via Vitest).
   - Ensure all API client error handling, mock adapter transformations, and form validation tests pass.

3. **Console Hygiene**:
   - Inspect browser devtools console during full user interaction.
   - Confirm zero uncaught runtime exceptions, zero missing React key warnings, and zero unhandled Promise rejections.

4. **Responsive Layout Check**:
   - Verify viewports at:
     - Mobile: 375px (iPhone SE) & 414px
     - Tablet: 768px (iPad)
     - Desktop: 1280px & 1440px
   - Ensure no horizontal overflow, unreadable text wrapping, or clipping buttons.

5. **Accessibility & Keyboard Navigation**:
   - Verify every form input has an associated `<label>` or `aria-label`.
   - Verify tab navigation flows logically through interactive elements.
   - Check focus rings are clearly visible.

6. **Interactive State Verification**:
   - Test loading states: Verify buttons show spinning indicators and disable double clicks.
   - Test empty states: Verify friendly guidance is displayed when data is absent.
   - Test error states: Trigger invalid input and network disconnections to confirm retry prompts appear.

7. **Mock vs. Live Backend Mode**:
   - Test `VITE_USE_MOCKS=true`: Ensure full mock interaction works smoothly without network calls.
   - Test `VITE_USE_MOCKS=false`: Ensure clear network connection error message appears if backend is offline.

8. **CORS & Network Inspection**:
   - Verify the backend base URL uses relative path or correct proxy/CORS configuration without hardcoded localhost IP conflicts.

9. **Secret Exposure Sanitization**:
   - Audit all files for accidental API keys, tokens, or personal credentials.
   - Ensure `.env` is listed in `.gitignore`.

10. **Delivery Handoff Report**:
    - Produce a concise summary report detailing:
      - Checks executed & outcomes
      - URLs & run commands
      - Known edge cases or pending enhancements
