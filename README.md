# Uncreator.Club - Creator Agency Portal

Welcome to the **Uncreator.Club** codebase. This repository houses the single-page landing ecosystem for **CREATOR.CORE / Uncreator.Club**, a premium, high-performance creator agency and talent management portal.

---

## 📂 Repository Structure

The project is structured as a lightweight, single-page web application using modern HTML5, CSS, and Tailwind CSS.

*   📂 **[.git](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/.git)**: Git repository metadata.
*   📄 **[code.html](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/code.html)**: The main application entry point containing all HTML structure, responsive layouts, components, custom Tailwind configurations, styles, and interactive scripts.
*   📄 **[DESIGN.md](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/DESIGN.md)**: Detailed documentation of the design system tokens (colors, typography, rounded scales, spacing rules) and component specifications.
*   🖼️ **[screen.png](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/screen.png)**: Pre-rendered screen reference of the page layout.

---

## 🎨 Design System & Visual Language

The design is built around the **Vivid Momentum** theme, blending **Modern Minimalism** with **Glassmorphism** and a striking dark-mode color scheme. Below is a quick overview of the key components detailed in [DESIGN.md](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/DESIGN.md):

### 🌈 Color Palette
*   **Primary (Electric Violet - `#d0bcff`)**: Brand highlights, key CTAs, and performance success states.
*   **Secondary (Cyan - `#4cd7f6`)**: Data visualizations, analytics details, and primary hover shadows.
*   **Tertiary (Lime - `#98da27`)**: Growth indicators, monetization alerts, and new features.
*   **Neutral (Charcoal `#131313` & Slate)**: Cinematic dark background system preventing eye strain.

### ✍️ Typography
*   **Montserrat**: Bold & display/headline font (e.g., Hero headers, main section titles).
*   **Inter**: Clean body copy for readability across devices.
*   **JetBrains Mono**: Technical numbers, labels, monetization values, and code-like precision stats.

---

## 🛠️ Development & Customization Guide

### 🚀 Running the Project
The application is entirely client-side. To run and inspect it locally:
1.  Double-click **[code.html](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/code.html)** to open it directly in any modern web browser.
2.  Alternatively, launch a local development server for automatic reloading:
    ```bash
    # Using python built-in server:
    python -m http.server 8000
    
    # Or using Node.js npx live-server:
    npx live-server
    ```

### ⚙️ Tailwind CSS Config
Tailwind CSS is integrated via CDN with an inline JavaScript configuration block inside **[code.html](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/code.html#L9-L99)**:
```html
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: { ... },
        borderRadius: { ... },
        spacing: { ... },
        fontFamily: { ... },
        fontSize: { ... }
      }
    }
  }
</script>
```
If you need to adjust color values, typography mappings, or rounded-corner defaults, update them in this script.

### ✨ Custom Utility Styles
Special visual effects are implemented via standard CSS inside the `<style>` block in **[code.html](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/code.html#L100-L120)**:
*   `.glass-card`: Semi-transparent background with backdrop blur filter (`backdrop-filter: blur(16px)`) and a light border.
*   `.glow-violet:hover`, `.glow-cyan:hover`, `.glow-lime:hover`: Accent-colored outer box-shadow glows.
*   `.text-gradient-primary`: Dual-color gradient overlay for prominent text highlights.

---

## 🧩 Component Blueprint

The website layout consists of the following key visual regions inside **[code.html](file:///c:/Users/sunny/iCloudDrive/IT/Uncreator.Club/code.html)**:

1.  **Top Navigation Bar (`<nav>`)**: Fixed top header with custom glassmorphic scroll-shadow effects toggled dynamically in JavaScript.
2.  **Hero Section (`<section>`)**: Heavy bold title typography, call-to-actions (CTAs), animated pulses, and dynamic statistics showing creator & payout scales.
3.  **Creator Value Prop (`<section>`)**: Focuses on creator CPM maximization, featuring interactive content creator stock illustration.
4.  **Brand Value Prop (`<section>`)**: Outlines campaign performance tracking metrics (CPV, average ROI) with action buttons to download brand kits.
5.  **Featured Bento Grid (`<section>`)**: Grid structure showcasing high-profile creator profile card, partner logos, client retention rates, and monthly conversions.
6.  **How It Works (`<section>`)**: Numeric protocol indicators (Join, Match, Grow) detailing onboarding flow.
7.  **Final CTA (`<section>`)**: Bold typographic invitation to join Uncreator.Club with button scales.
8.  **Footer (`<footer>`)**: Clean footer layout housing links to terms, privacy, press, contact details, and copyright notices.

---

## ⚡ Future Expansion Guidelines

When extending the codebase, please keep these recommendations in mind:
*   **Aesthetics Focus**: Retain the premium glassmorphism design. Avoid adding components with generic primary colors (e.g. basic `#0000ff` blue). Use the established violet, cyan, and lime color rules.
*   **Scale and Performance**: Use native layouts with flex/grid containers. Ensure all interactive sections have unique IDs and proper semantic elements for best SEO and accessibility practices.
*   **Images**: When updating images, specify clear descriptive descriptions in `data-alt` attributes to support automated workflows.
