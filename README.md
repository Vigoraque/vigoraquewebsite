# Vigoraque

Marketing website for **Vigoraque** — the international brand of **Shanghai Shen-Tech
Graphite Material Co., Ltd.**, a manufacturer and exporter of carbon & graphite products
(graphite electrodes, anodes, special graphite, carbon blocks & pastes) since 2001.

Built as a single static page — **plain HTML, CSS and vanilla JS, no build step** — so it
deploys to **Vercel** as-is.

## Design

An **industrial-corporate** look modeled on the styling of industry peers like
grafitrezzi.com, rather than a generic template:

- **Full-bleed dark hero** with a background photo, dark overlay and a large overlaid
  headline.
- **Fixed graphite + white palette** with a single **green** accent (`#059669`).
- **Hexagonal accent motifs** by section headings (the "exa"/graphite cue).
- **Photo-driven product gallery** with hover zoom, instead of icon cards.
- **Animated stat counters** that count up from 0 when scrolled into view.
- **Uppercase labels/nav, square corners, hairline rules** — no rounded pills or glassy
  cards. Sticky header that turns solid graphite on scroll.
- **EN / 中文** language switch (currently visual only — see notes below).

## Files

| File | Purpose |
|------|---------|
| `index.html` | The whole page (header, hero, stats, company, products, capabilities, contact, footer). |
| `styles.css` | Industrial design tokens + all component styles + responsive layout. |
| `script.js` | Sticky-header scroll state, mobile nav, scroll-spy, animated counters, language stub, contact-form validation/submission. |
| `favicon.svg` | Site icon (green graphite hexagon). |
| `assets/logo.svg` | Standalone logo mark (the header uses an inline copy). |

## Preview locally

Open `index.html` in a browser — no server required. Or serve it:

```bash
python -m http.server 5173   # then http://localhost:5173
# or
npx serve .
```

## ⚙️ Before you go live — placeholders to fill in

All are marked with `TODO` comments in the source.

1. **Images (currently free Unsplash stock).** Replace with real photos of your products
   and facility:
   - **Hero background:** in `styles.css`, the `.hero` rule's `background:` URL. Swap for
     your own image, or replace the `<section class="hero">` background with a
     `<video autoplay muted loop>` for a video hero like the reference site.
   - **Product photos:** in `index.html`, each `<article class="tile"><img src="…">` in
     the Products gallery.
   - **Company photo:** the `.about-media` `<img>` in the Company section.
   - Note: stock images load from `images.unsplash.com` over HTTPS. For full independence,
     download them into `assets/` and point the paths there.

2. **Contact form (Formspree).** The form posts to a placeholder endpoint.
   - Create a free form at <https://formspree.io> and copy its form ID (e.g. `xdorwk…`).
   - In `index.html`, replace `REPLACE_ME` in `https://formspree.io/f/REPLACE_ME`.
   - Until then, the form validates and shows a friendly reminder instead of sending.

3. **Contact details.** In `index.html`, update the `TODO`-marked **email**
   (`sales@vigoraque.com`) and **phone** (`+86 000 0000 0000`). The Shanghai address is set.

4. **Footer.** Replace the placeholder **LinkedIn** URL (`href="#"`) and confirm which
   **certifications** apply (ISO 9001 / 14001 / SGS are placeholders — swap for real badge
   logos if you have them).

5. **中文 translations (optional).** The EN / 中文 switch currently only toggles the active
   state and the page `lang` attribute. To make it functional, add translated content and
   wire it up in `script.js` where the `TODO` marks the language handler.

## Deploy to Vercel

Static site — no configuration needed.

**CLI**
```bash
npm i -g vercel
cd Vigoraque
vercel        # framework preset: "Other"
vercel --prod
```

**Git + dashboard:** push to GitHub → Vercel **Add New → Project** → import → framework
**Other** → root = folder containing `index.html` → Deploy.

## Customizing the look

- **Accent color:** change `--green` / `--green-bright` / `--green-hover` in `:root` in
  `styles.css`.
- **Corner roundness:** `--radius` (set to `2px` for the sharp industrial feel).
- **Palette:** the `--graphite-*`, `--paper*`, and `--line*` tokens at the top of
  `styles.css`.
- **Content:** all copy lives in `index.html` — edit text in place.
