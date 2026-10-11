---
name: hackathon-problem-intake
description: Deconstruct the official hackathon problem statement into an actionable technical MVP plan, API contracts, risk assessment, and implementation tasks.
---

# Hackathon Problem Intake Guide

Use this skill immediately upon receiving the official hackathon problem statement to rapidly convert ambiguity into an execution-ready development plan.

## 10-Step Rapid Intake Protocol

1. **Read and Document**:
   - Ingest the official problem statement, challenge description, and judging criteria verbatim into `HACKATHON_BRIEF.md`.
   - Never invent requirements or assume unstated judging constraints.

2. **Requirements Segmentation**:
   - Separate explicit requirements (mandatory deliverables, target outcomes) from implicit assumptions and optional nice-to-haves.

3. **User & Journey Definition**:
   - Identify target persona, core pain point, primary input, expected output, and the single critical user journey that judges will evaluate.

4. **API Discovery & Verification**:
   - List all required APIs (internal backend or 3rd-party).
   - Verify documentation availability, API keys/auth methods, rate limits, latency profiles, and CORS constraints.
   - If an API has barriers (e.g., paywall, delayed access approval), document fallbacks immediately.

5. **Risk and Feasibility Analysis**:
   - Highlight potential failure points (unreliable endpoints, network timeouts, complex payload parsing).
   - Prepare local mock fallback data so frontend progress never stalls waiting on backend readiness.

6. **Scope the 8-Hour MVP**:
   - Define the absolute smallest functional product that completely solves the core challenge.
   - Reject premature features: defer authentication, admin panels, complex settings, and multi-tenancy.

7. **Establish API Contract**:
   - Formalize the endpoints in `API_CONTRACT.md` specifying methods, routes, request headers/bodies, response shapes, and error structures.

8. **Component & Screen Blueprint**:
   - Specify the exact screens and reusable UI components needed from `src/components/ui/` to fulfill the primary user flow.

9. **Prioritized Action Plan**:
   - Generate a chronological task list with time allocations (e.g., Phase 1: API Contract & Mocking, Phase 2: Feature UI & User Journey, Phase 3: Integration & Testing, Phase 4: Polish & Quality Gate).

10. **Immediate Execution**:
    - Avoid excessive documentation cycles. Once the plan is established in `HACKATHON_BRIEF.md` and `API_CONTRACT.md`, immediately hand off to `rapid-frontend-development`.
