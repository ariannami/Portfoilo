# Hero Scrim Removal & Custom IntersectionObserver Lazy-Loading

This plan removes the dark `.hero__scrim` gradient overlay from the first section so the hero render displays at full clarity, and implements the custom `IntersectionObserver` in `app.js` to lazy-load all below-the-fold `.mobile-img` elements with a `200px` lookahead margin and smooth opacity fade-in.

## User Review & Critical Decisions

> [!IMPORTANT]
> All key decisions have been confirmed during interactive clarification and are incorporated below.

- **Confirmed Decision 1 — Hero Brightness**: Remove the dark `.hero__scrim` gradient overlay (`<div class="hero__scrim"></div>` and its CSS rule) completely from the first section so the hero render is no longer darkened.
- **Confirmed Decision 2 — Target `.mobile-img` Scope**: Tag all below-the-fold images across every section with `.mobile-img` and lazy-load them via `IntersectionObserver`.
- **Confirmed Decision 3 — Observer Threshold & Transition**: Use a **`200px` vertical `rootMargin`** (`rootMargin: '200px 0px'`) with a **smooth opacity fade-in** once each image loads, while keeping the SVG `clip-path` focus overlays (`.media-focus`) hidden until a subsystem hotspot is selected.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. Eliminates the dark gradient veil over the hero section so the industrial render of the AgriVision hardware stands out clearly on arrival.
  2. Defers below-the-fold image requests until the user scrolls within `200px` of each `.mobile-img` element using a custom `IntersectionObserver` in `app.js`.
- **Target Audience / Persona**: Industrial design directors, hardware recruiters, and agronomy stakeholders viewing the showcase across desktop and mobile connections.
- **Key Value**: Full visual clarity in the above-the-fold hero viewport paired with minimal mobile data consumption below the fold.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Unobstructed Hero Viewport**: The hero render (`/assets/aistudio/Untitled1_da706d99.jpg`) renders at full native contrast without the `45%`–`98%` dark `.hero__scrim` gradient covering it, while headlines retain crisp legibility via their subtle text shadows.
  2. **200px Lookahead Hydration & Smooth Reveal**: As the user scrolls toward below-the-fold sections, the `IntersectionObserver` promotes `data-src` and `data-srcset` (including `<picture>` `<source>` WebP tags) to active `src` and `srcset` attributes and fades each visible image in smoothly (`opacity: 0` → `opacity: 1`).
  3. **Synchronized Interactive Subsystem Layers**: For the Aerial Unit and Ground Station interactive inspectors, all stacked `.mobile-img` layers hydrate when their media viewport approaches the screen, while `.media-focus` layers stay at `opacity: 0` until a subsystem hotspot or specification card is clicked.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Complete Removal of `.hero__scrim`**
  - *Chosen Approach*: Remove `<div class="hero__scrim" aria-hidden="true"></div>` from the `.hero` DOM and delete the `.hero__scrim` CSS block.
  - *Why*: Directly resolves the overly dark appearance of the first section without altering the hero typography or layout.

- **Decision 2: `data-src` / `data-srcset` Hydration with `<picture>` Support**
  - *Chosen Approach*: Store the real asset URLs in `data-src` and `data-srcset` on all below-the-fold `.mobile-img` elements (and `data-srcset` on sibling `<source>` elements inside `<picture>`), swapping them into `src` / `srcset` inside the `IntersectionObserver` callback before calling `observer.unobserve(img)`.
  - *Why*: Enforces a deterministic `200px` preload distance on mobile data connections while preserving aspect-ratio bounding boxes (`width` and `height` attributes) for zero layout shift.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Rendering Pipeline Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Above-the-Fold Hero Section (.hero)                 │
│  • Hero <img>: Eager load, full native brightness (No .hero__scrim)     │
│  • Preloader Gate: Dismisses as soon as Hero <img> + Font finish        │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│         Custom IntersectionObserver in app.js (rootMargin: "200px 0px") │
│  • Observes all below-the-fold .mobile-img elements                     │
│  • Fallback: Immediate hydration if IntersectionObserver unsupported    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                       (Element enters 200px zone)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Hydration & Decode Pipeline                         │
│  1. Promote <picture> <source data-srcset> -> srcset                    │
│  2. Promote <img data-srcset> -> srcset & <img data-src> -> src         │
│  3. Unobserve element (observer.unobserve)                              │
│  4. On img.decode() / load -> add .is-lazy-loaded (smooth fade-in)      │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - **Hero Viewport**: Renders `.hero__photo img` directly beneath `.grid` and `.hl` without `.hero__scrim`.
  - **`.mobile-img` Observer Controller**: Queries `document.querySelectorAll('.mobile-img')`, attaches an `IntersectionObserver({ rootMargin: '200px 0px', threshold: 0.01 })`, hydrates `src`/`srcset` on intersection, and adds `.is-lazy-loaded` upon image load/decode completion.
  - **Drone View Switcher Integration (`setDroneView`)**: Updates both active `src`/`srcset` and `data-src`/`data-srcset` attributes when toggling between Front View and Back View.
