---
name: SSLGuard Stitch Design System
version: 2.4.0
author: Google Stitch Architecture
design_paradigm: "Modern Cyber-Intelligence & Glassmorphic Precision"
tokens:
  colors:
    primary:
      50: "#eff6ff"
      100: "#dbeafe"
      500: "#3b82f6"
      600: "#2563eb"
      700: "#1d4ed8"
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)"
    accent_cyber:
      cyan: "#06b6d4"
      indigo: "#6366f1"
      purple: "#8b5cf6"
    status:
      valid:
        base: "#10b981"
        bg_light: "rgba(16, 185, 129, 0.1)"
        border: "rgba(16, 185, 129, 0.25)"
      expiring:
        base: "#f59e0b"
        bg_light: "rgba(245, 158, 11, 0.1)"
        border: "rgba(245, 158, 11, 0.25)"
      expired:
        base: "#f43f5e"
        bg_light: "rgba(244, 63, 94, 0.1)"
        border: "rgba(244, 63, 94, 0.25)"
      unreachable:
        base: "#8b5cf6"
        bg_light: "rgba(139, 92, 246, 0.1)"
        border: "rgba(139, 92, 246, 0.25)"
    neutrals:
      light:
        bg_base: "#f8fafc"
        bg_surface: "#ffffff"
        bg_elevated: "#f1f5f9"
        border_subtle: "#e2e8f0"
        border_strong: "#cbd5e1"
        text_primary: "#0f172a"
        text_secondary: "#475569"
        text_muted: "#94a3b8"
      dark:
        bg_base: "#090d16"
        bg_surface: "#0f172a"
        bg_elevated: "#1e293b"
        border_subtle: "#1e293b"
        border_strong: "#334155"
        text_primary: "#f8fafc"
        text_secondary: "#cbd5e1"
        text_muted: "#64748b"
  typography:
    font_sans: "Inter, system-ui, -apple-system, sans-serif"
    font_mono: "JetBrains Mono, Menlo, monospace"
    letter_spacing:
      tight: "-0.025em"
      normal: "-0.01em"
      wide: "0.05em"
  radii:
    button: "0.875rem"
    card: "1.25rem"
    panel: "1.5rem"
    pill: "9999px"
  shadows:
    glass: "0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03)"
    card_hover: "0 20px 35px -10px rgba(37, 99, 235, 0.12)"
    primary_glow: "0 4px 14px 0 rgba(37, 99, 235, 0.35)"
---

# SSLGuard Stitch Design System Manifest

## 1. Design Vision & Philosophy
The **SSLGuard Stitch Design System** adheres to Google Stitch's AI-native principles:
- **Clarity over Clutter**: Prioritize high-signal security posture metrics (TLS version, expiration countdown, certificate authority trust chain) over decorative elements.
- **Glassmorphic Precision**: High-blur backdrops (`backdrop-blur-xl`), ultra-thin translucent borders (`rgba(255, 255, 255, 0.1)` on dark, `rgba(226, 232, 240, 0.8)` on light), and floating ambient radial gradients.
- **Instant Cryptographic Feedback**: Real-time status indicators (pulsing green dots for healthy TLS, amber warning countdowns, and red expired alert badges).
- **Responsive Symmetry**: 2-column hero landing layouts, 50/50 split authentication screens, and modular dashboard metric cards that adapt gracefully across mobile and wide displays.

---

## 2. Color System & Semantic Intent

### Primary & Accent Spectrum
| Token | Light Hex | Dark Hex | Role |
| :--- | :--- | :--- | :--- |
| `primary` | `#2563eb` | `#3b82f6` | Primary action buttons, active navigation states, key highlights |
| `accent-cyan` | `#0891b2` | `#06b6d4` | Live diagnostic indicators, cyber badges, TLS 1.3 chips |
| `accent-indigo` | `#4f46e5` | `#6366f1` | Secondary gradient stops, cryptographic algorithms |

### Health & Cryptographic State Tokens
| State | Light | Dark | Meaning |
| :--- | :--- | :--- | :--- |
| **Healthy / Valid** | `#059669` / `bg-emerald-500/10` | `#10b981` / `bg-emerald-500/15` | Valid certificate with >30 days remaining |
| **Expiring Soon** | `#d97706` / `bg-amber-500/10` | `#f59e0b` / `bg-amber-500/15` | Expires within proactive 30-day window |
| **Expired** | `#e11d48` / `bg-rose-500/10` | `#f43f5e` / `bg-rose-500/15` | Certificate expired; immediate renewal required |
| **Port Closed** | `#7c3aed` / `bg-purple-500/10` | `#8b5cf6` / `bg-purple-500/15` | Host unreachable on port 443 |

---

## 3. Component Architecture & Patterns

### 3.1 Buttons
- **`btn-primary`**:
  - Gradient background: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #4f46e5 100%)`
  - Radius: `0.875rem` (`rounded-xl` / `rounded-2xl`)
  - Elevation: `shadow-lg shadow-blue-600/30`
  - Micro-interaction: `transform: translateY(-1px)` on hover, active state returns to `translateY(0)`
- **`btn-secondary`**:
  - Translucent surface with subtle border: `border border-slate-200/80 dark:border-slate-800/80`
  - Hover: `bg-slate-100 dark:bg-slate-800`

### 3.2 Form Inputs & Search Fields
- **Smart URL Sanitization**: Form inputs automatically strip `https://`, `http://`, trailing slashes, and paths on paste or blur.
- **Port Auto-Extraction**: Inputs automatically extract embedded ports (e.g. `example.com:8443` -> Host `example.com`, Port `8443`).
- **Padding & Icons**: Left icon offset `pl-11` (or `input-with-icon-left`), right toggle icon `pr-11`.

### 3.3 Stitch Live Certificate Cards
- **Header**: Domain name, pulsing live dot, and verification status pill (`Valid TLS 1.3`).
- **Grade Badge**: High-contrast square/rounded badge (`A+`, `A`, `B`, `C`, `F`) with matching background tint.
- **Days Counter**: Bold numerical countdown (`66d`, `39d`) with "Remaining" sub-label.
- **Metadata Matrix**: 4-cell grid highlighting Valid From, Expires On, Signature Algorithm, and Key Bit Strength.
- **Lifetime Progress Bar**: Continuous horizontal gradient bar representing certificate lifespan.

### 3.4 Command Palette / Quick Search (Stitch Standard)
- Shortcut: `Ctrl+K` or `Cmd+K`, or Header Quick Scan button.
- Instant domain lookup, page routing, and theme toggling without leaving the current view.

---

## 4. Layout & Grid Standards
- **Landing Page**:
  - Header: Sticky blur bar with Logo, navigation links, and Auth CTAs.
  - Hero: 2-Column split (7-cols headline + inline analyzer on left; 5-cols live certificate glass card on right).
  - Stat Strip: 4-metric highlight grid (`100% Socket Handshakes`, `<200ms Average Latency`, `30 Days Proactive Alert Window`, `RFC 5280 PKI Compliance`).
- **Dashboard**:
  - Time-based greeting banner (`Good morning/afternoon/evening`).
  - 6-Metric responsive cards grid.
  - 2:1 ratio for Expiry Timeline Bar Chart and Security Grade Pie Chart.
  - Full-width Live Audit Stream.
- **Authentication**:
  - 50/50 split canvas on desktop (`min-h-screen flex flex-col lg:flex-row`).
  - Left column: Visual brand narrative + live glass certificate preview card.
  - Right column: Clean credential form with home navigation and theme toggle.

---

## 5. Accessibility & Motion
- **WCAG 2.1 AAA Contrast**: All foreground text on surfaces meets minimum 4.5:1 (small text) and 3:1 (large text) contrast ratios in both light and dark themes.
- **Reduced Motion**: Respects `prefers-reduced-motion` by reducing animation durations to `0.01ms`.
- **Keyboard Navigation**: Dedicated `:focus-visible` ring `2px solid #3b82f6` with `outline-offset: 2px`.
