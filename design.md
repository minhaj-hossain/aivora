---
name: Professional Enterprise System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
---

## Brand & Style

The brand personality of this design system is authoritative, composed, and highly dependable. It is designed for enterprise-grade environments where clarity and trust are paramount. The target audience includes decision-makers and professional users who require a high-density information environment that remains breathable and easy to navigate.

The aesthetic follows a **Minimalist Corporate** direction. It avoids unnecessary decoration, instead finding beauty in precise alignment, generous whitespace, and a strict adherence to a sophisticated color palette. The goal is to evoke a sense of quiet confidence and technical excellence.

## Colors

The palette is anchored by a deep, authoritative primary Navy Blue, signaling stability and expertise. This is supported by a secondary Slate and a tertiary Steel Blue to provide depth without introducing distracting hues. 

The neutral scale utilizes cool grays to maintain a crisp, modern feel. 
- **Primary (#0F172A):** Used for key brand moments, primary actions, and high-level headings.
- **Surface Neutrals:** A range of cool grays from `#F8FAFC` (Background) to `#E2E8F0` (Borders) ensures a clean, tiered interface.
- **Accents:** Semantic colors for success or error should be desaturated to align with the professional tone of the primary Navy.

## Typography

This design system uses a dual-font strategy to balance character with utility. 
- **Hanken Grotesk** is used for headlines and display text. Its sharp, contemporary geometry provides a sophisticated "tech-forward" edge.
- **Inter** is used for all body copy, inputs, and labels. It is chosen for its exceptional legibility in data-heavy enterprise applications and its neutral, systematic tone.

Text scales are tight and purposeful. Tracking is slightly tightened on large headlines for a more premium look, while labels utilize increased letter spacing and uppercase styling for distinct categorization.

## Layout & Spacing

The layout philosophy relies on a **Fixed Grid** system for desktop to maintain a controlled, premium reading experience.
- **Desktop (1440px+):** 12-column grid with 24px gutters and 48px side margins. 
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px gutters and margins.

Spacing follows an 8pt linear scale (with 4px increments for micro-adjustments). Intentional "white gaps" are used to separate logical sections rather than heavy divider lines, ensuring the UI feels airy despite the professional rigor.

## Elevation & Depth

To maintain a minimal and high-contrast aesthetic, this design system prioritizes **Low-contrast outlines** and **Tonal layers** over heavy drop shadows.

- **Level 0 (Base):** The primary background color (#F8FAFC).
- **Level 1 (Surface):** White cards (#FFFFFF) with a 1px border in a light cool gray (#E2E8F0).
- **Level 2 (Interaction):** Very subtle, highly diffused shadows (0px 4px 12px rgba(15, 23, 42, 0.04)) are used only for floating elements like dropdowns or modals.
- **Depth via Contrast:** Depth is primarily communicated through the contrast between the Navy primary elements and the light gray backgrounds, rather than physical simulation.

## Shapes

The shape language is **Soft**, utilizing a 4px (0.25rem) base radius. This provides a subtle modern touch that softens the "coldness" of the navy and gray palette without becoming overly playful or casual.

- **Small Components (Buttons, Inputs):** 4px radius.
- **Medium Components (Cards, Modals):** 8px (0.5rem) radius.
- **Large Components (Sections):** 12px (0.75rem) radius.

This consistency in rounding ensures that the interface feels cohesive and engineered.

## Components

### Buttons
- **Primary:** Solid Navy (#0F172A) with white text. No gradient. High-contrast hover states (moving to a slightly lighter slate).
- **Secondary:** Outline-only using the primary navy or a medium gray border.
- **Ghost:** Text-only with a subtle background fill on hover.

### Input Fields
- **Default:** White background, 1px cool-gray border.
- **Focus:** Border changes to Navy with a subtle 2px "ring" in a transparent light blue to indicate focus without shifting layout.

### Chips & Badges
- Used for status and tagging. These should use light-tinted backgrounds (e.g., a very pale blue) with dark navy text to maintain legibility and professional tone.

### Cards
- Flat design with a 1px border (#E2E8F0). No shadows unless they are interactive (on-hover elevation shift).

### Lists
- High vertical rhythm with 12px or 16px of internal padding. Dividers are used sparingly and should be #F1F5F9 (very low contrast) to keep the focus on the content.
