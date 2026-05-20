---
name: TravaPro Functional System
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#1f51da'
  primary: '#0038af'
  on-primary: '#ffffff'
  primary-container: '#1b4fd8'
  on-primary-container: '#cbd4ff'
  inverse-primary: '#b6c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#37465c'
  on-tertiary: '#ffffff'
  tertiary-container: '#4e5e74'
  on-tertiary-container: '#c7d7f2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success: '#10B981'
  danger: '#EF4444'
  text-primary: '#0F172A'
  text-muted: '#64748B'
  border: '#E2E8F0'
  currency-mad: '#1B4FD8'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  currency-display:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the high-stakes environment of Moroccan construction and field services. It balances the robust utility of **enterprise SaaS** (inspired by Monday.com and Odoo) with the **tactile accessibility** required for field workers using PWAs on mobile devices.

The aesthetic is **Corporate / Modern**, emphasizing clarity, efficiency, and reliability. It utilizes high-contrast interfaces to ensure legibility under direct sunlight on construction sites and structured layouts to manage complex data like project timelines, worker assignments, and regulatory compliance.

**Key Brand Pillars:**
- **Local Precision:** Specialized data structures for Moroccan administrative requirements (ICE, IF, RC).
- **Efficiency:** Rapid data entry and high-density information displays.
- **Reliability:** A sturdy, professional look that builds trust between contractors and clients.

## Colors

The palette is anchored by a **Deep Blue (#1B4FD8)** to convey authority and stability, paired with a high-visibility **Amber (#F59E0B)** for calls to action and critical status updates.

- **Primary:** Used for main actions, navigation states, and branding.
- **Secondary (Accent):** Reserved for high-priority alerts, progress indicators, and "New Task" buttons.
- **Functional Colors:** Success (Green) and Danger (Red) follow standard semantic patterns to ensure immediate recognition of project health and safety alerts.
- **Surface Strategy:** We use a light-gray background (`#F8FAFC`) to provide a soft contrast against pure white cards (`#FFFFFF`), reducing eye strain during long periods of data entry.

## Typography

The typography system uses **Inter** for its exceptional legibility on small screens and its neutral, professional tone. 

- **Hierarchy:** We use tight tracking and bold weights for headlines to maintain a structured "tabular" feel similar to project management tools.
- **Labels:** Small caps with slight letter spacing are used for administrative headers like "ICE", "IF", and "RC" to distinguish them from user-generated content.
- **Mobile Adaptation:** Large headlines scale down significantly on mobile to ensure that data tables and project titles remain visible without excessive scrolling.
- **Numerical Data:** For MAD currency values and project IDs, utilize medium or bold weights to ensure financial figures are the most legible elements on the page.

## Layout & Spacing

The design system employs a **Fluid Grid** approach designed for PWA responsiveness.

- **Desktop:** 12-column grid with a maximum content width of 1440px. 24px gutters provide breathing room for complex data tables.
- **Mobile:** 4-column grid with 16px side margins. Elements are stacked vertically, with an emphasis on "full-width" touch targets for users who may be wearing gloves or working in active environments.
- **Rhythm:** A 4px baseline grid ensures consistent vertical alignment. Use 16px (md) as the default padding for cards and containers to maintain a high information density without feeling cluttered.

## Elevation & Depth

To maintain a clean and professional look, depth is communicated through **Tonal Layers** and **Subtle Shadows** rather than heavy gradients.

- **Level 0 (Background):** `#F8FAFC` — Used for the main canvas.
- **Level 1 (Cards/Surface):** `#FFFFFF` — Used for the primary content containers. Features a subtle shadow: `0 2px 8px rgba(0,0,0,0.08)`.
- **Level 2 (Modals/Popovers):** `#FFFFFF` — Elevated with a slightly more pronounced shadow to indicate interactivity and focus.
- **Interactive States:** Buttons use a slight vertical shift or a subtle glow when hovered, but avoid skeuomorphic "pressing" effects to keep the UI modern and flat.

## Shapes

The shape language is varied to create visual hierarchy between different functional elements:

- **Cards & Major Containers:** `12px` (rounded-lg) to provide a soft, modern container for project data.
- **Input Fields & Buttons:** `8px` (soft) to maintain a professional, slightly more rigid feel for data entry.
- **Badges, Chips, & Status Tags:** `24px` (pill-shaped) to make these small elements highly distinguishable from text and buttons.

## Components

### Buttons & Inputs
- **Primary Action:** Solid Blue (`#1B4FD8`) with 8px radius. High contrast white text. 
- **Form Inputs:** White background, 1px border (`#E2E8F0`). On focus, the border transitions to Primary Blue with a 2px stroke.
- **Legal Fields:** Specific inputs for **ICE (Identifiant Commun de l’Entreprise)**, **IF**, and **RC** include validation masks and helper text to ensure compliance with Moroccan regulations.

### Data Display
- **Status Badges:** Use pill shapes (`24px` radius). Success uses green background with dark green text; Pending uses Amber; Danger uses Red.
- **Currency (MAD):** Always display "MAD" as a suffix. Use bold weights for the numeric value.
- **Field-Ready Cards:** Cards for mobile include large touch-targets for "Call Client" or "Navigate to Site" using the primary blue color.

### Lists & Tables
- **Mobile Lists:** High-density rows (48px - 56px height) with chevron indicators for drill-down.
- **Desktop Tables:** Striped rows using `#F8FAFC` for even lines to assist horizontal eye-tracking across project metrics.