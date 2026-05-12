---
name: Institutional Digital Identity
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4b'
  primary: '#006c4b'
  on-primary: '#ffffff'
  primary-container: '#26a678'
  on-primary-container: '#003321'
  inverse-primary: '#66dca9'
  secondary: '#366285'
  on-secondary: '#ffffff'
  secondary-container: '#abd6ff'
  on-secondary-container: '#305e80'
  tertiary: '#006687'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b9ece'
  on-tertiary-container: '#003042'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#84f8c4'
  primary-fixed-dim: '#66dca9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005138'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#a0cbf3'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#1a4a6c'
  tertiary-fixed: '#c1e8ff'
  tertiary-fixed-dim: '#74d1ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d67'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built on the principles of stability, security, and institutional trust. The visual language is influenced by European administrative standards, favoring clarity and legibility over decorative flair. 

The style is **Corporate / Modern**, characterized by a structured layout and a controlled color palette. It evokes a sense of official authority and digital sovereignty, ensuring that users feel their data is handled with the highest level of professionalism. The aesthetic is clean and sober, avoiding unnecessary ornamentation to maintain focus on utility and accessibility.

## Colors

The palette is derived directly from the institutional identity, emphasizing a professional deep teal and a commanding midnight navy.

- **Primary (Deep Teal/Green):** Used for primary actions, success states, and brand recognition. It represents growth and official validation.
- **Secondary (Midnight Navy):** Extracted from the logo border and typography, this color is used for headers, navigation, and high-level structural elements to provide a grounded, secure frame.
- **Backgrounds:** A combination of pure white for content areas and very light grey-blues for page-level backgrounds. This "cool" neutral foundation reinforces the institutional feel.
- **Support Colors:** Tints of the secondary navy are used for borders and disabled states, ensuring a monochromatic harmony that feels intentional and integrated.

## Typography

The design system utilizes **Public Sans** across all levels. This typeface was selected for its neutral, yet contemporary institutional character, originally designed for government use.

Headlines use semi-bold and bold weights in the secondary navy to establish a clear hierarchy. Body text is set with generous line heights to ensure maximum readability, particularly for legal or technical documentation. Letter spacing is slightly tightened for large displays and slightly increased for captions to maintain legibility at all scales.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model to maintain a disciplined and organized interface. A 12-column grid is used for desktop views, transitioning to a flexible 4-column grid for mobile devices.

A strict 8px spacing scale ensures consistency across all components. Content is typically contained within cards or defined sections to create a sense of order. Margins and gutters are kept generous to prevent the UI from feeling cluttered, reinforcing the "sober" and "secure" brand promise.

## Elevation & Depth

To maintain a secure and professional atmosphere, this design system avoids aggressive shadows or dramatic 3D effects. Depth is conveyed primarily through:

- **Tonal Layers:** Using the light grey-blue neutral for the background and pure white for the primary content containers.
- **Low-Contrast Outlines:** Containers and cards use subtle 1px borders in a light navy tint (#D1D9E0) rather than heavy shadows.
- **Ambient Softness:** Where elevation is necessary (such as active modals), a very diffused, low-opacity shadow is used, tinted with the secondary navy to keep the depth feeling "cool" and integrated with the palette.

## Shapes

The shape language is **Soft**, balancing approachable modernism with institutional rigidity. 

Standard components like buttons and input fields use a 0.25rem (4px) corner radius. This small degree of rounding prevents the interface from feeling "sharp" or aggressive while remaining significantly more formal than pill-shaped or highly rounded designs. Larger containers like cards may use a slightly increased radius (0.5rem) to differentiate them from smaller interactive elements.

## Components

- **Buttons:** Primary buttons use the deep teal green with white text. Secondary buttons use an outline style with the navy blue. Hover states should involve a slight darkening of the fill color rather than a shadow increase.
- **Input Fields:** Designed with a white background and a subtle navy-tinted border. The "focus" state uses the primary teal for the border and a very soft outer glow to indicate activity.
- **Chips & Tags:** Small, low-contrast elements used for status indicators (e.g., "Verified," "Pending"). They use light pastel versions of the primary and secondary colors.
- **Cards:** White surfaces with a 1px border. Cards should not be stacked; they should live side-by-side or in a vertical list to maintain a flat, accessible hierarchy.
- **Progress Indicators:** Use the primary teal for completion. For security-related progress (like identity verification), include a small lock icon in the secondary navy to reinforce trust.
- **Alerts/Notifications:** Standard institutional colors: Teal for success, Navy for info, and a muted red/amber for errors/warnings, always accompanied by clear iconography.