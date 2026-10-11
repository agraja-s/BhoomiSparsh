# AGRISENTRY DESIGN SYSTEM SPECIFICATION

Anchored on the **Bhumisparsh** agricultural design language ([bhumisparsh.lovable.app/dashboard](https://bhumisparsh.lovable.app/dashboard)) and aligned with **Google Stitch** component standards.

---

## 1. Visual Philosophy & Outdoor Accessibility

- **Audience**: Farmers operating smartphones outdoors in varying sunlight conditions.
- **Key Tenet**: High contrast, tactile touch targets ($\ge 44\text{px}$), calming agricultural greens, warm ivory backgrounds, and zero decorative cognitive clutter.
- **Tone**: Empathetic, trustworthy, grounded, and scientific without alienating technical jargon.

---

## 2. Color Palette Tokens

### Primary Agricultural Green
- `brand-forest`: `#1B5E20` (Primary action headers, primary buttons, brand mark)
- `brand-field`: `#2E7D32` (Interactive hover states, active tabs)
- `brand-surface`: `#E8F5E9` (Selected item badges, success banners)
- `brand-tint`: `#F1F8E9` (Subtle container backgrounds)

### Backgrounds & Neutrals (Warm Earth & Ivory)
- `bg-earth`: `#FBFBFA` (App canvas background, reduces outdoor glare)
- `bg-warm`: `#F4F5F0` (Secondary panel backgrounds)
- `surface-card`: `#FFFFFF` (Primary card surface with crisp border)
- `border-subtle`: `#E2E8F0` (Card and input borders)
- `text-primary`: `#0F172A` (Headings, primary metrics, high contrast)
- `text-secondary`: `#475569` (Field labels, helper text, forecast descriptions)
- `text-muted`: `#64748B` (Timestamps, footnotes)

### Semantic Disease Risk Spectrum
- **Low Risk**: `#15803D` (Emerald 700) | Surface: `#DCFCE7` (Green 100)
- **Moderate Risk**: `#D97706` (Amber 600) | Surface: `#FEF3C7` (Amber 100)
- **High Risk**: `#DC2626` (Red 600) | Surface: `#FEE2E2` (Red 100)
- **Inconclusive / Uncertain**: `#64748B` (Slate 500) | Surface: `#F1F5F9` (Slate 100)

### Meteorological Accents
- **Temperature**: `#EA580C` (Orange 600)
- **Relative Humidity**: `#0284C7` (Sky 600)
- **Precipitation**: `#2563EB` (Blue 600)

---

## 3. Typography Scale & Multilingual Readability

Font Family: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif`.
- Designed for seamless font rendering across **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.

- **Hero Title**: `text-2xl sm:text-3xl font-extrabold tracking-tight`
- **Section Heading**: `text-lg sm:text-xl font-bold text-slate-900`
- **Subheading**: `text-base font-semibold text-slate-800`
- **Body Text**: `text-sm sm:text-base font-normal text-slate-700 leading-relaxed`
- **Caption / Form Labels**: `text-xs sm:text-sm font-semibold text-slate-700`
- **Badges / Micro Data**: `text-xs font-medium`

---

## 4. Tactile Components & Spacing

- **Touch Targets**: Minimum 44px height for all buttons, inputs, and tab selectors.
- **Card Styling**: `bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6`.
- **Form Controls**: Large input boxes with clear label pairings, camera buttons, and high-contrast focus rings (`focus:ring-2 focus:ring-emerald-600`).
