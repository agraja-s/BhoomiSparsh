---
name: agrisentry-frontend-design
description: Guidelines and component implementation patterns for AgriSentry's farmer-first design system inspired by Bhumisparsh and Google Stitch.
---

# AgriSentry Frontend Design Guide

This skill governs the visual architecture and component development for AgriSentry, ensuring an empathetic, clean, and farmer-centered experience.

## Design Rules

1. **Agricultural Color System**:
   - Primary: Deep forest green (`#1B5E20`) and field green (`#2E7D32`).
   - Surfaces: Warm ivory canvas (`#FBFBFA`) and crisp white cards (`#FFFFFF`) with subtle borders (`#E2E8F0`).
   - Accents: Sky blue (`#0284C7`) for atmospheric weather metrics, Amber (`#D97706`) for caution windows, and Emerald (`#15803D`) for healthy states.

2. **Farmer-Centric Simplicity**:
   - Make the next action immediately obvious on every screen.
   - Avoid generic tech dashboards filled with cluttered decorative widgets.
   - Use high-contrast text to ensure legibility on mobile screens under direct sunlight.

3. **Time-Series Risk Visualization**:
   - Use responsive Recharts area/line charts with readable X-axis timestamps.
   - Color code risk zones: 0–39 Low (Green), 40–69 Moderate (Amber), 70–100 High (Rose/Red).
   - Display a clear intervention or monitoring window if predicted by the model.

4. **Component Hierarchy**:
   - Compose features from reusable atomic components in `src/components/ui/`.
   - Keep business logic in custom hooks under `src/hooks/` and domain services in `src/services/`.
