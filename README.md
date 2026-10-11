# 🌾 AgriSentry (भूमिस्पर्श - BhumiSparsh)
### Micro-Climatic Crop Disease Early Warning & Multilingual AI Diagnosis System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![n8n](https://img.shields.io/badge/n8n-Workflow%20Automation-EA4B71?logo=n8n&logoColor=white)](https://n8n.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%20Passing-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 📌 Executive Summary

**AgriSentry** is an end-to-end, farmer-first agricultural intelligence platform designed to prevent catastrophic crop losses caused by micro-climatic fungal and pest epidemics (such as Late Blight in tomato and potato, Downy Mildew in grapes, and Blast in rice). 

By uniting **hyper-local micro-climate telemetry**, **Google Gemini Vision multimodal AI**, **n8n automated workflow pipelines**, and **Supabase cloud persistence**, AgriSentry equips farmers with:
1. **Early Micro-Climatic Warning**: Predictive risk modeling calculating leaf wetness duration, relative humidity, and temperature triggers *before* symptoms become visible.
2. **Instant Multilingual Visual Diagnosis**: Instant plant leaf photo analysis with pathogen classification, confidence scores, organic bio-remedies (e.g., *Trichoderma*, Neem oil), and chemical spray schedules.
3. **Inclusive Dialect Support**: Native localization and speech advisory in **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
4. **Closed-Loop Ground Truth Feedback**: A farmer outcome confirmation mechanism that continuously collects real-world post-treatment outcomes and benchmarks prediction accuracy against ground reality.

---

## 🏗️ System Architecture & Workflow Flow

```
                                      ┌────────────────────────────────────────────────────────┐
                                      │                      FARMER / USER                     │
                                      │  (Web Browser / Mobile PWA - High Contrast Tactile UI) │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  │
                                      ┌───────────────────────────┴────────────────────────────┐
                                      │           AgriSentry Frontend (React + Vite)           │
                                      │  - BhumiSparsh Design Tokens (Green/Earth/Amber/Red)   │
                                      │  - Audio / Voice Advisory (EN, HI, MR)                 │
                                      │  - Dedicated Supabase Auth (Sign In / Sign Up)         │
                                      └───────┬───────────────────────────────┬────────────────┘
                                              │                               │
                      1. Image & Farm Telemetry│               2. Outcome Feedback / Verify
                                              ▼                               ▼
                      ┌───────────────────────────────┐       ┌───────────────────────────────┐
                      │    n8n Workflow Engine:       │       │    n8n Workflow Engine:       │
                      │   Assessment & Diagnosis      │       │     Outcome Feedback Loop     │
                      └───────┬───────────────┬───────┘       └───────────────┬───────────────┘
                              │               │                               │
        3. Multimodal Analysis│               │4. Weather Telemetry           │5. Sync Ground Truth
                              ▼               ▼                               ▼
                      ┌──────────────┐ ┌──────────────┐               ┌───────────────┐
                      │ Google Gemini│ │ Open-Meteo   │               │   Supabase    │
                      │  1.5 Flash   │ │ Weather API  │               │ PostgreSQL DB │
                      └──────────────┘ └──────────────┘               └───────┬───────┘
                                                                              │
                                                              6. Controlled Evaluation Loop
                                                                      (Workflow 2)
                                                                              ▼
                                                              ┌───────────────────────────────┐
                                                              │ Precision / Recall Analytics  │
                                                              │ & Rule Version Performance    │
                                                              └───────────────────────────────┘
```

---

## 🚀 Key Technologies & Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** | Blazing-fast SPA with hot module reloading and optimized bundle delivery. |
| **Programming Language**| **TypeScript (Strict Mode)**| Strong contract types for telemetry, assessments, feedback, and user sessions. |
| **Design System** | **BhumiSparsh Custom CSS** | Farmer-first tactile UI: large touch targets (48px+), high contrast ratios, rural visual hierarchy. |
| **Authentication** | **Supabase Auth** | Clean, dedicated email/password authentication without third-party vendor clutter. |
| **Database** | **Supabase PostgreSQL** | Cloud database storing assessments, farmer feedback records, evaluation benchmarks, and rule sets. |
| **Workflow Automation**| **n8n Cloud** | Serverless orchestrator connecting frontend webhooks, LLMs, external APIs, and databases. |
| **Multimodal Vision AI**| **Google Gemini 1.5 Flash** | Leaf pathology detection, lesion segmentation inference, and multilingual advisory generation. |
| **Weather Telemetry** | **Open-Meteo API** | Real-time temperature, dew point, relative humidity, and rainfall data. |
| **Testing** | **Vitest + RTL** | 100% passing automated test suite covering authentication, diagnosis, telemetry, and error states. |

---

## 🔄 Integrated n8n Workflows

AgriSentry integrates three critical asynchronous n8n pipelines:

### 1. Assessment & Multilingual AI Diagnosis Workflow
* **Webhook Endpoint**: `POST /webhook/api/v1/assessments`
* **Trigger**: Farmer captures a crop leaf photo and inputs location or GPS coordinates.
* **Process**:
  1. Validates base64 leaf image payload and geolocation metadata.
  2. Queries Open-Meteo API for 72-hour temperature and relative humidity trends.
  3. Sends image and micro-climate context to **Google Gemini 1.5 Flash**.
  4. Formats standardized output: crop identified, pathogen, confidence score (%), urgency level, organic remedies, chemical remedies, and audio advisory scripts in Hindi, Marathi, and English.
  5. Inserts the record into the Supabase `assessments` table.
* **Response**: Returns rich structured diagnostic payload instantly to the frontend.

### 2. Workflow 1: Outcome & Feedback Collection
* **Webhook Endpoint**: `POST /webhook/api/v1/assessment-feedback`
* **Trigger**: 3 to 7 days post-treatment, farmer confirms whether the crop recovered.
* **Process**:
  1. Receives `assessment_id`, `actual_outcome` (`recovered`, `partially_recovered`, `misdiagnosed`, `worsened`), notes, and follow-up photo.
  2. Upserts record into Supabase `assessment_feedback` table.
  3. Flags verified ground-truth entries for model validation.

### 3. Workflow 2: Controlled Evaluation Loop
* **Trigger**: Automated schedule or manual benchmark run.
* **Process**:
  1. Joins `assessments` with verified `assessment_feedback` ground truth.
  2. Computes **Precision**, **Recall**, and **F1-Score** across disease categories and risk thresholds.
  3. Logs run analytics into `evaluation_runs` and correlates with active `risk_rule_versions`.

---

## 🗄️ Database Schema (`supabase_schema.sql`)

The repository includes a complete production schema file: [`supabase_schema.sql`](file:///c:/Users/ASUS/Documents/hackathon/supabase_schema.sql).

### Key Tables
1. **`assessments`**: Stores every diagnostic query, farmer ID, crop type, location, weather metrics, AI diagnosis, confidence %, and recommendation details.
2. **`assessment_feedback`**: Records post-treatment farmer verification, actual disease observed, recovery rating (1-5), and verification photo URLs.
3. **`evaluation_runs`**: Records pipeline evaluation runs, tracking accuracy, precision, recall, and false positive rates.
4. **`risk_rule_versions`**: Manages micro-climatic disease rule thresholds (e.g., Tomato Late Blight: Temp 15-22°C + RH > 90% for > 10 hours).

---

## ⚙️ Environment Configuration

The application reads configurations from `.env` (configured at root and inside `frontend/`):

```bash
# Backend / API Base URL (if using local proxy)
VITE_API_BASE_URL=http://localhost:5000

# Toggle between live n8n / Supabase mode and standalone mock mode
VITE_USE_MOCKS=false

# n8n Live Assessment Webhook URL
VITE_N8N_ASSESSMENT_URL=https://prat7.app.n8n.cloud/webhook/api/v1/assessments

# n8n Live Outcome Feedback Webhook URL
VITE_N8N_FEEDBACK_URL=https://prat7.app.n8n.cloud/webhook/api/v1/assessment-feedback

# Supabase Project Configuration
VITE_SUPABASE_URL=https://ztcxkluntahlxutjxxse.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_kEDraG-UTfbLnxJuoYCNXw_WheE4nyQ
```

---

## 💻 Local Setup & Execution Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/agraja-s/API-Integration.git
cd API-Integration
```

### 2. Configure Environment Variables
The repository comes pre-configured with the required environment files (`.env` and `frontend/.env`). Ensure the keys match your active Supabase and n8n instances.

### 3. Initialize Supabase Database
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project -> Navigate to the **SQL Editor**.
3. Copy and run the entire script from [`supabase_schema.sql`](file:///c:/Users/ASUS/Documents/hackathon/supabase_schema.sql).
4. Verify that the tables (`assessments`, `assessment_feedback`, `evaluation_runs`, `risk_rule_versions`) are created with Row-Level Security enabled.

### 4. Install Dependencies
```bash
cd frontend
npm install
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

### 6. Run the Test Suite
AgriSentry includes automated Vitest unit and integration tests:
```bash
npm run test
```
All tests should pass cleanly (19/19 passing).

### 7. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
Production assets are generated in `frontend/dist/`.

---

## 📱 User Journey & Key Screens

1. **Landing Page**: Micro-climatic overview, real-time regional risk barometer, call-to-action to begin diagnosis.
2. **Dedicated Sign In / Sign Up**: Simple, clean farmer authentication backed by Supabase with session persistence.
3. **Farm Telemetry & Weather**: Hyper-local weather telemetry display with humidity alerts and consecutive danger hours.
4. **Crop Assessment & Camera Upload**: Visual leaf inspection with instant upload to Gemini Vision via n8n.
5. **Multilingual Diagnostic Results**: Pathogen identification, confidence gauge, organic treatment recommendations, and audio advisory in English, Hindi, and Marathi.
6. **Ground Truth Feedback Dialog**: Post-treatment outcome verification modal allowing farmers to validate recommendations and improve system accuracy.

---

## 👥 Contributors & Hackathon Team
* **AgriSentry Team** — Building AI-driven climate resilience for smallholder agriculture.
