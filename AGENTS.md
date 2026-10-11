# AGENTS INSTRUCTIONS & PROJECT RULES

These rules govern all AI coding assistants and team members working on this hackathon codebase.

## 1. Source of Truth
- Once released, the official problem statement documented in `HACKATHON_BRIEF.md` is the absolute functional source of truth.
- `DESIGN.md` defines the visual and component styling rules (anchored on Google Stitch).
- `ARCHITECTURE.md` defines system patterns and state boundaries.
- `API_CONTRACT.md` dictates backend and third-party API communication.

## 2. Engineering Directives
- **Strict TypeScript**: Do not use `any`. Define strong interfaces in `src/types/`.
- **Atomic Components**: Build all UI by composing reusable components from `src/components/ui/`.
- **API Discipline**: Never make raw `fetch()` calls in React UI components. All calls must route through `src/lib/api/client.ts` and domain services in `src/services/`.
- **Mock Isolation**: Keep mock implementations behind identical service interfaces. Toggle via `VITE_USE_MOCKS`. Never fabricate fake success data in live mode.
- **Zero Secret Leaks**: Never put private API keys, backend secrets, or service passwords in client-side environment files (`VITE_*`).
- **Minimal, Surgical Changes**: Implement the smallest reliable diff that accomplishes the goal. Preserve working code.
- **Continuous Quality Gate**: After modifying code, run `npm run build` and `npm run test` in `frontend/`. Never claim tests passed without observing actual output.

## 3. Skill Invocation Triggers
- When the problem statement arrives: activate `hackathon-problem-intake`.
- When styling or expanding UI: activate `stitch-design-implementation` and `rapid-frontend-development`.
- When integrating endpoints: activate `api-frontend-integration`.
- Before final demonstration: activate `frontend-quality-gate`.
