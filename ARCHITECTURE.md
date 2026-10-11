# FRONTEND ARCHITECTURE & DATA FLOW SPECIFICATION

## 1. Architectural Overview

The application follows an **Unidirectional Data Flow** with a clean separation of concerns:
```
[User Interaction in UI Component]
              │
              ▼
    [Custom React Hook]  (State: loading, data, error)
              │
              ▼
    [Domain Service Layer] (src/services/)
              │
    ┌─────────┴─────────┐
    │                   │
    ▼ (Mock Mode)       ▼ (Live Mode)
[Mock Adapter]     [API Client (src/lib/api/)]
    │                   │
    └─────────┬─────────┘
              ▼
    [Standardized Result/Error Object]
              │
              ▼
    [UI Component State Update & Re-render]
```

---

## 2. Component & Directory Responsibilities

- **`src/app/`**: Application shell (`App.tsx`), global navigation header, footer, layout wrapper, and mock status banner.
- **`src/components/ui/`**: Pure presentation primitives:
  - `Button`: Primary, secondary, outline, ghost styles; loading spinner and disabled states.
  - `Input`: Label, helper text, error message, leading/trailing icons.
  - `Card`: Surface panel with header, content, footer sections.
  - `Badge`: Status indicators (success, error, warning, mock-mode).
  - `Skeleton`: Shimmer placeholder for loading states.
  - `Alert`: Contextual inline notification boxes (info, success, warning, destructive).
- **`src/components/feedback/`**: Reusable operational feedback states (`EmptyState`, `ErrorState`, `LoadingState`).
- **`src/features/`**: Challenge-specific business logic and screens. Contains `features/demo/` for the starter architecture demonstration, and will host `features/<challenge>/` when the problem is announced.
- **`src/lib/api/`**: Centralized HTTP client using Fetch API, standardizing request execution, timeouts, headers, and error parsing.
- **`src/services/`**: Feature-specific API bridges implementing domain methods.
- **`src/mocks/`**: Deterministic mock generators providing realistic local fallback responses.
- **`src/types/`**: Strongly typed domain models, API requests/responses, and error schemas.

---

## 3. Data Flow in Detail

1. **User Input**: A user inputs data into a form component (e.g. `DemoIntegrationCard.tsx`).
2. **Hook Delegation**: The component calls an action method on a custom hook (e.g., `useDemoIntegration()`).
3. **Service Dispatch**: The hook delegates to the domain service (e.g., `demoService.processRequest(input)`).
4. **Adapter Switching**:
   - If `VITE_USE_MOCKS=true`: The service calls `mockDemoAdapter.process(input)` and returns structured fake data after a simulated delay (600ms).
   - If `VITE_USE_MOCKS=false`: The service calls `apiClient.post('/api/demo/process', input)`.
5. **Response Normalization**: Any HTTP error, timeout, or schema mismatch is mapped into an `ApiError` with human-readable diagnostic messages.
6. **UI State Render**: The hook stores `result`, `error`, or `isLoading`, rendering the appropriate visual state (`EmptyState`, `LoadingSkeleton`, `ResultCard`, or `ErrorState` with retry button).

---

## 4. Environment Configuration & Mock Mode

Frontend configuration is driven strictly by Vite environment variables:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCKS=true
```

- When running without a backend (or when third-party APIs are down), developers toggle `VITE_USE_MOCKS=true`.
- The UI renders an omnipresent visual badge indicating:
  - 🟢 **Live Backend Mode**: Requests route to `VITE_API_BASE_URL`.
  - 🔵 **Mock Demo Mode**: Requests execute locally via mock adapters.

---

## 5. Connecting a Future Backend

When Developer 2 on the team finishes the backend service:
1. Ensure the backend implements the endpoints agreed in `API_CONTRACT.md`.
2. Configure CORS in the backend to allow requests from `http://localhost:5173`.
3. Set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL=http://localhost:5000` (or the backend developer's local port) in `.env`.
4. The frontend will immediately transmit requests over the network without changing any UI code.
