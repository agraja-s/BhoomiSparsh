# HACKATHON BRIEF — AGRISENTRY

> **Product**: AgriSentry — Micro-Climatic Crop Disease Early Warning System  
> **Challenge**: API & API Integration Hackathon (8-Hour Sprint)  
> **Repository**: [https://github.com/agraja-s/API-Integration](https://github.com/agraja-s/API-Integration)  
> **Design Reference**: Bhumisparsh ([https://bhumisparsh.lovable.app/dashboard](https://bhumisparsh.lovable.app/dashboard)) + Google Stitch  

---

## 1. Challenge Overview & Problem Statement

Farmers often discover crop disease only after visible damage has already spread across the field, resulting in heavy yield loss and reactive over-spraying of expensive chemicals.

**AgriSentry** provides a proactive, micro-climatic crop disease early warning system that:
1. **Analyzes crop imagery** uploaded by farmers for crop type and visual disease symptoms using computer vision / Gemini.
2. **Retrieves hyper-local environmental forecasts** (hourly temperature, relative humidity, precipitation, leaf wetness potential) via weather APIs (Open-Meteo).
3. **Fuses image-derived evidence with temporal weather forecasts** into a multi-variable disease risk suitability timeline (0–100 index).
4. **Delivers understandable, time-gated practical advisories** to farmers, preventing unnecessary chemical sprays and guiding optimal inspection windows.

---

## 2. Official Judging Criteria

1. **Diagnostic Precision**: Correctly interpreting crop images, communicating uncertain or inconclusive disease candidates, and avoiding false confidence claims.
2. **Multi-Variable Risk Modeling**: Defensibly combining image findings with temporal environmental conditions (temperature, humidity, leaf wetness) across 24–72 hour forecasts.
3. **Intervention Viability**: Providing practical, appropriately gated farmer advisories that do not trigger false chemical treatment alarms or prescribe unauthorized pesticides.

---

## 3. Target User & Persona

- **Primary User**: Indian farmer using a smartphone outdoors, with limited time, variable sunlight, and limited familiarity with technical/scientific jargon.
- **Key Questions Answered**:
  - What might be wrong with my crop?
  - How reliable is this assessment?
  - What are upcoming temperature and humidity conditions?
  - How will these conditions affect disease progression over the next 24–72 hours?
  - What practical steps should I take next, and when should I recheck?
- **Secondary Users**: Agricultural extension officers, agronomy advisors, and hackathon evaluators inspecting API orchestration and risk modeling.
- **Language Support**: Trilingual support in **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)** for the primary workflow.

---

## 4. Minimum Viable Product (MVP) Scope

### Experience A — Farmer Dashboard
- AgriSentry branding with farmer-friendly early-warning message.
- Prominent "Start New Assessment" call-to-action button.
- Live / Mock mode transparency indicator.
- 3-step explanation: Crop Image Analysis $\rightarrow$ Local Forecast $\rightarrow$ Risk Timeline.
- Language switcher (English / मराठी / हिंदी).
- Recent assessments overview with clearly labeled demo entries.

### Experience B — New Field Assessment
- Crop selection (Tomato, Potato, Rice, Wheat, Cotton, Soybean, Onion, Chilli).
- Crop growth stage (Seedling, Vegetative, Flowering, Fruiting, Mature).
- Camera-compatible field image upload with validation (max 10MB, JPG/PNG/WebP), preview, replace, and remove.
- Field coordinates with one-tap GPS autofill and manual latitude/longitude fallback.
- Optional farmer observations / field notes.
- "Analyze Crop Health" submit trigger with full validation and loading feedback.

### Experience C — Assessment Results
- **Section 1: Crop & Image Diagnosis**: Image preview, identified crop, disease candidate with confidence/uncertainty, and support for inconclusive results.
- **Section 2: Upcoming Micro-Climatic Weather**: Hourly forecast for next 24–72 hours (temperature °C, relative humidity %, precipitation).
- **Section 3: Disease-Risk Timeline**: Interactive Recharts curve (0–100 index) displaying time-based risk progression, risk categories (Low, Moderate, High), and monitoring window.
- **Section 4: Multimodal Analysis Explanation**: Plain-language explanation separating image observations, weather influences, and remaining uncertainties.
- **Section 5: Practical Advisory**: Clear severity, actionable steps (cultural practices, scouting, timing), and recheck schedule without premature chemical spray recommendations.
