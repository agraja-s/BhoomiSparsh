# Hackathon Frontend Foundation

A modular, testable, and rapidly adaptable React + TypeScript + Tailwind CSS frontend architecture built for an **8-hour API & API Integration Hackathon**.

Anchored on design tokens extracted via the **Google Stitch MCP integration** and structured for frictionless 2-developer collaboration.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on v26)
- **npm**: v9+ (tested on v12)

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Environment Setup
The project comes with an `.env.example`. Create your local `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCKS=true
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Quality Gates

Run the automated checks from the `frontend/` directory:
```bash
# Typecheck & Build
npm run build

# Run Unit / Integration Tests
npm run test
```

---

## 📁 Repository Structure

```text
├── .agents/
│   └── skills/                   # Antigravity Agent Skills
│       ├── stitch-design-implementation/
│       ├── hackathon-problem-intake/
│       ├── api-frontend-integration/
│       ├── rapid-frontend-development/
│       └── frontend-quality-gate/
├── frontend/
│   ├── src/
│   │   ├── app/                  # App shell, Navbar, Layout
│   │   ├── components/           # Reusable UI & Feedback components
│   │   │   ├── ui/               # Button, Input, Card, Badge, Alert, Skeleton
│   │   │   └── feedback/         # EmptyState, ErrorState, LoadingState
│   │   ├── features/             # Feature slices (features/demo/, future challenge features)
│   │   ├── hooks/                # Custom React state & integration hooks
│   │   ├── lib/api/              # Centralized Fetch API client
│   │   ├── services/             # Domain service layer
│   │   ├── mocks/                # Deterministic mock adapters
│   │   ├── types/                # Strict TypeScript interfaces
│   │   └── test/                 # Vitest test specs
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── AGENTS.md                     # Core agent and developer directives
├── HACKATHON_BRIEF.md            # Problem intake template (fill when problem is announced)
├── ARCHITECTURE.md               # Data flow & component lifecycle documentation
├── API_CONTRACT.md               # Binding API specification for frontend & backend
├── DESIGN.md                     # Stitch design tokens & typography scale
└── README.md
```

---

## 🚀 How to Transition to the Real Hackathon Problem

When the official problem statement is announced:

1. Paste the statement and judging criteria into your Antigravity conversation and prompt:
   > *"Read `HACKATHON_BRIEF.md`, the official problem statement, and `AGENTS.md`. Invoke the `hackathon-problem-intake` skill. Define the simplest competitive MVP, update `API_CONTRACT.md`, and build the challenge feature."*
2. The agent will populate `HACKATHON_BRIEF.md`, define endpoints in `API_CONTRACT.md`, and create a new feature slice in `src/features/<challenge>/` using the pre-built UI primitives.
3. Your backend teammate can build endpoints against `API_CONTRACT.md` independently while you test against mock data.
4. When the backend is ready, switch `VITE_USE_MOCKS=false` to go live!
