---
name: agrisentry-accessibility
description: Accessibility and multilingual standards for rural and agricultural web applications in English, Marathi, and Hindi.
---

# AgriSentry Accessibility Guide

This skill ensures AgriSentry complies with WCAG AA accessibility standards, outdoor visual clarity, and full trilingual usability for Indian farmers.

## Core Directives

1. **Multilingual Architecture**:
   - Provide complete, native translation for all user journeys in **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
   - Do not stop at translating navigation titles; translate form labels, field placeholders, validation errors, diagnostic terms, weather units, and advisory steps.

2. **Tactile Touch Targets**:
   - All interactive controls (buttons, camera triggers, dropdowns) must maintain a minimum touch target size of 44x44px.

3. **High-Contrast Text & Color Independence**:
   - Never rely solely on color to communicate disease severity.
   - Always pair risk colors with explicit text badges (e.g. "Low Risk", "Moderate Risk", "High Risk") and icons.
   - Maintain a minimum contrast ratio of 4.5:1 for body copy and 3:1 for large headers.

4. **Screen Reader and Keyboard Readiness**:
   - Form inputs must possess explicit `id` attributes matched with `<label htmlFor="...">`.
   - Dynamic alert regions must use `role="alert"` or `aria-live="polite"`.
   - Focus rings must be clearly visible (`focus-visible:ring-2 focus-visible:ring-emerald-700`).
