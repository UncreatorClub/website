---
name: Vivid Momentum
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#98da27'
  on-tertiary: '#213600'
  tertiary-container: '#6ba000'
  on-tertiary-container: '#1c2f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#b2f746'
  tertiary-fixed-dim: '#98da27'
  on-tertiary-fixed: '#121f00'
  on-tertiary-fixed-variant: '#334f00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system is engineered for a high-performance Creator Agency, balancing the raw energy of digital content creation with the rigorous professionalism of a talent management firm. The brand personality is **authoritative, kinetic, and forward-leaning**, designed to appeal to both top-tier digital talent and data-driven brand partners.

The aesthetic fuses **Modern Minimalism** with **Glassmorphism** and **High-Contrast** elements. It utilizes deep charcoal foundations to provide a cinematic backdrop, allowing vibrant "creator accents" to command attention. The visual language emphasizes monetization and growth through precise, technical details paired with bold, expressive typography.

## Colors

The palette is optimized for a dark-mode-first experience, ensuring high visual impact and reduced eye strain during long-form content review.

- **Primary (Electric Violet):** Used for primary actions, success metrics, and brand highlights. It represents creativity and high-value conversion.
- **Secondary (Cyan):** Used for technical data, secondary interactive elements, and information architecture.
- **Tertiary (Lime):** Reserved for "Growth" indicators, monetization alerts, and "New" badges. It provides a sharp, high-energy contrast against the charcoal base.
- **Neutral (Charcoal & Slate):** The background utilizes a multi-layered charcoal (`#121212`) to create depth without true-black flatness. Text ranges from pure white for headings to muted silver for metadata.

## Typography

The typography system relies on a hierarchy of power and precision. **Montserrat** is the voice of the agency—bold, heavy-weighted, and unapologetic. It should be used for all major marketing claims and section headers. 

**Inter** provides a highly legible, systematic foundation for body copy and data-heavy tables, ensuring performance metrics are easily digestible. **JetBrains Mono** is introduced for technical labels and monetization figures, lending a "pro-tool" aesthetic that evokes developer-level precision and trust in the data.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Asymmetric Momentum," where content blocks are often offset to create a sense of movement.

- **Desktop:** Large horizontal margins (64px) create a focused central stage. Elements should use 24px gutters to allow the glassmorphic effects space to breathe.
- **Mobile:** Margins tighten to 20px. Vertical stacking should prioritize "Impact Cards"—full-width elements that showcase creator imagery or high-level stats.
- **Rhythm:** All spacing (padding, margins, gaps) must be multiples of 8px to maintain a strict mathematical rigour beneath the creative visuals.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Luminous Glo-shadows**. Instead of traditional grey shadows, this system uses:

1.  **Backdrop Blurs:** Surface containers use a semi-transparent charcoal (e.g., `rgba(24, 24, 27, 0.7)`) with a 12px–20px blur radius. This allows background colors and gradients to peek through, creating a sense of layered reality.
2.  **Luminous Outlines:** Interactive cards use a 1px border with a subtle gradient (Primary to Transparent) to define edges in a dark environment.
3.  **Accent Glows:** High-priority elements (like active creator profiles) utilize a low-opacity color tint (Violet or Cyan) as an outer glow rather than a black drop shadow, simulating a neon-emissive light source.

## Shapes

The shape language is **"Geometric-Soft."** While the brand is high-energy and professional, the `rounded-lg` (16px) standard ensures the UI feels modern and accessible rather than aggressive or dated.

- **Standard Buttons/Inputs:** 8px (Soft).
- **Cards & Sections:** 16px (Rounded).
- **Profile Avatars & Featured Badges:** Full pill-shaped (Circle) to contrast against the rectangular grid.
- **Interactive States:** On hover, cards may "expand" or increase their corner radius slightly to indicate life and responsiveness.

## Components

### Buttons
- **Primary:** Solid Electric Violet with white Montserrat Bold text. Use a slight glow effect on hover.
- **Ghost:** 1px Cyan border with transparent background. Becomes solid Cyan on hover.
- **Monetization (Action):** Solid Lime background with black text for maximum urgency and visibility.

### Cards
- **Performance Card:** Glassmorphic background with a 1px top-light border. Contains a "JetBrains Mono" label for the metric and a "Montserrat" bold number for the value.
- **Creator Profile:** Features a full-bleed image background with an overlay gradient that transitions from transparent to deep charcoal at the bottom to house the name and stats.

### Inputs & Selection
- **Fields:** Darker charcoal than the background with a 1px Slate border. On focus, the border transitions to Electric Violet with a 2px glow.
- **Chips:** Small, pill-shaped tags using the Secondary color (Cyan) at 10% opacity for the background and 100% opacity for the text.

### Dynamic Elements
- **Progress Bars:** Use a gradient from Cyan to Violet to represent growth or campaign completion. 
- **Data Visuals:** Charts should use the Tertiary Lime for "positive growth" and Primary Violet for "reach/engagement" metrics.