# Vigoraque — Enhanced (GSAP)

A more ambitious version of the Vigoraque site (Shanghai Shen-Tech Graphite, est. 2001),
same brand and content as the parent `Vigoraque/` site but with a **reworked layout** and
**rich, choreographed motion** powered by **GSAP + ScrollTrigger**.

Still **plain HTML/CSS/JS, no build step** — GSAP loads from a CDN. Open `index.html`
directly, or deploy the folder to Vercel as-is.

> The original, simpler site lives one level up in `Vigoraque/` and is untouched.

## What's different from the base site

- **Asymmetric hero** with a parallax background, headline that reveals **word-by-word**,
  and a hex accent that drifts with the cursor.
- **Infinite marquee** ticker of product/keyword terms (slows on hover).
- **Animated counters** that count up on scroll.
- **Products = pinned horizontal showcase** on desktop — the section pins and the product
  panels scroll sideways as you scroll down. On mobile / reduced-motion it's a clean
  vertical stack.
- **Bento grid** capabilities section with staggered reveals and hover lift.
- **Magnetic "Get a quote" button**, animated nav underlines, scroll-reveal throughout.

## Accessibility & robustness (built in)

- **Reduced motion:** if the OS "reduce motion" setting is on, all animation, parallax and
  pinning are skipped and every element is shown statically.
- **Progressive enhancement:** if the GSAP CDN is blocked or fails, the page still renders
  fully with all content visible — nothing depends on JS to be readable.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup with `data-reveal` / `data-hero` hooks and the GSAP CDN tags. |
| `styles.css` | Industrial design tokens, reworked layouts, reveal + reduced-motion states. |
| `script.js` | Core UX (nav, form, scroll-spy) + all GSAP choreography, wrapped in `gsap.matchMedia()`. |
| `favicon.svg`, `assets/logo.svg` | Hexagon brand mark. |
| `product.css`, `product.js` | Shared styles + logic for the product detail pages. |
| `products/*.html` | One detail page per product (graphite-electrodes, graphite-anodes, special-graphite, carbon-blocks-pastes). |

## Product pages

Each product in the home page's side-by-side showcase is a **clickable link** (whole panel
+ a "View product" button) that opens its own page under `products/`, e.g.
`products/graphite-electrodes.html`. Every product page has:

- a full-bleed **hero** with breadcrumb, title and quote CTA;
- an **overview** with key highlights;
- a **specifications table** — *values are representative placeholders*
  (marked `TODO`); replace them with your verified datasheet figures;
- an **applications** grid;
- an **image gallery** (stock placeholders → swap for real photos);
- a **quote CTA band** and an **"other products"** strip linking to the siblings.

To add a product: copy one of the `products/*.html` files, update the content, then add a
matching `<a class="panel" href="products/your-file.html">` panel in `index.html` and a
card in each page's "other products" strip.

## Preview locally

Open `index.html` in a browser (needs internet for the GSAP CDN + stock images), or serve:

```bash
python -m http.server 5173   # http://localhost:5173
# or
npx serve .
```

## ⚙️ Before you go live — placeholders (all marked `TODO` in the source)

1. **Images (Unsplash stock).** Swap for real photos:
   - Hero background: `.hero-bg` `background:` URL in `styles.css` (or replace with a
     `<video>` and adjust the parallax target in `script.js`).
   - Product photos: each `.panel .panel-media img` in `index.html`.
   - Company photo: `.about-media img`.
   - For full independence, download into `assets/` and repoint the paths.
2. **Formspree form ID:** replace `REPLACE_ME` in the form `action` (create a free form at
   <https://formspree.io>). Until then the form validates and shows a reminder.
3. **Contact details:** update the `TODO` email / phone.
4. **Footer:** real LinkedIn URL; confirm certifications (ISO placeholders).
5. **中文 translations:** the EN / 中文 switch is visual only — wire up real content where
   the `TODO` marks the handler in `script.js`.

## Deploy to Vercel

Static site — no config. Import the repo, framework preset **Other**, and set the project
**root directory to this `enhanced/` folder** (or deploy it as its own project). Note the
GSAP CDN + Unsplash images load over HTTPS at runtime; self-host both for full independence.

## Tuning the motion

- **Horizontal scroll speed / feel:** the `scrub` value and `end` in the pinned showcase
  ScrollTrigger (`script.js`).
- **Reveal timing:** the `start: 'top 88%'` and `duration` in the `[data-reveal]` loop.
- **Marquee speed:** the `duration` of the marquee tween.
- **Turn a piece off:** remove its block in `script.js` — the markup degrades gracefully.
