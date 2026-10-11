---
name: api-frontend-integration
description: Architect, implement, and maintain reliable HTTP communication between React frontend features and backend or third-party APIs with mock fallbacks.
---

# API Frontend Integration Guide

This skill governs connecting frontend interfaces to backend services, handling data transformations, network resilience, secure credential handling, and transparent mock mode switching.

## Architectural Mandates

1. **Centralized API Client**:
   - All network calls must pass through `src/lib/api/client.ts`. Never use raw `fetch()` or `axios` directly inside React UI components.
   - Centralize base URLs, headers (`Content-Type`, `Accept`, Authorization), timeout abort controllers, and error serialization.

2. **Strict TypeScript Typing**:
   - Model all request payloads and response bodies in `src/types/`. Avoid `any`.
   - Distinguish domain models from transport DTOs when necessary.

3. **Secure Credential Discipline**:
   - **Never inject private API keys or server secrets into client-side environment variables (`VITE_*`)**.
   - Frontend variables must only contain public endpoints (e.g., `VITE_API_BASE_URL`) or feature flags (`VITE_USE_MOCKS`).
   - If an external provider requires secret keys, route requests through the hackathon backend service.

4. **Transparent Mock / Live Switching**:
   - Keep mock implementations and live HTTP services behind identical TypeScript interface definitions.
   - When `VITE_USE_MOCKS=true`, services return deterministic, structured mock data without hitting network endpoints.
   - Clearly flag mock mode in the UI so users and evaluators understand whether data is local or live.

5. **Error & Edge-Case Handling**:
   - Handle 4xx client errors (validation, authentication, not found).
   - Handle 5xx server errors with user-friendly error messages and retry capability.
   - Handle network disconnections, timeouts, and CORS rejections gracefully.
   - Never fabricate fake success data in live mode when an API call fails.
