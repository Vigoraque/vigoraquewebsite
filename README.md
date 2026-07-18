# Vigoraque

Marketing website for **Vigoraque** (by Global Resource) — a Dubai-based supplier of
graphite electrodes, smelting additives and ferroalloys for the global steel and metal
smelting industry.

Static site: plain HTML, CSS and JavaScript with **GSAP** (via CDN) for motion. No build
step — open `index.html` directly, or deploy the folder as-is.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home page — rotating hero, taglines, about, product showcase, capabilities, contact. |
| `styles.css` | Main stylesheet (industrial theme, green accent). |
| `home.css` | Home-only additions: rotating hero crossfade + tagline row. |
| `script.js` | Motion + interactions (GSAP reveals, pinned product scroll, counters, form). |
| `product.css`, `product.js` | Shared styles + logic for product detail pages. |
| `products/*.html` | One page per product: `graphite-electrodes`, `smelting-additives`, `ferroalloys`. |
| `images/` | Source images; `images/site/` holds the web-optimised photos used across the site. |
| `favicon.svg`, `assets/logo.svg` | Hexagon brand mark. |
| `original/` | The earlier, simpler version of the site (kept for reference). |
| `wrangler.jsonc`, `.assetsignore` | Cloudflare config to serve the folder as a static site. |

## Placeholders to fill before launch

- **Contact form:** replace `REPLACE_ME` in `index.html` (`formspree.io/f/REPLACE_ME`) with
  your [Formspree](https://formspree.io) form ID.
- **Contact details:** email and phone in `index.html` (marked `TODO`).
- **LinkedIn URL** in the footer.
- **Specifications** on each product page are representative placeholders (marked `TODO`) —
  replace with your verified datasheet values.
- **Certifications** in the footer — confirm which apply and add real badge logos.

## Deploy

Hosted on Cloudflare Pages/Workers from GitHub (`Vigoraque/vigoraquewebsite`). Any push to
`main` auto-deploys. Also works on Vercel with no config (framework preset "Other").
