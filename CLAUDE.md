# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static landing page for **CliniCard** ([clinicard.fr](https://clinicard.fr)), a medical revision app for French medical students (PASS, LAS, EDN/ECOS). The site promotes the iOS app and captures early-access interest.

## Structure

The deployable site lives entirely in `docs/` (served via GitHub Pages):

- `docs/index.html` — main landing page (~480 lines)
- `docs/styles.css` — all styles (~1165 lines)
- `docs/script.js` — interactivity: smooth scroll, header shadow, scroll-reveal, phone carousel, store button logic
- `docs/privacy-policy.html` — privacy policy page
- `docs/auth-redirect.html` — OAuth redirect handler
- `docs/assets/` — images: app screenshots (`screen-1.jpeg` … `screen-6.jpeg`), logo, OG image

The `docs/website/` subdirectory contains legacy/reference files (older README and deployment guide) — not served directly.

## Local development

No build step. Serve the `docs/` directory with any static server:

```bash
cd docs
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

## Key design tokens

- Primary blue: `#1D4ED8`
- Accent green: `#10B981`
- Fonts: **Playfair Display** (headings) + **Plus Jakarta Sans** (body)

## Launch flag

In `docs/script.js`, the `IS_PUBLIC_LAUNCH` boolean controls store button behavior:
- `true` → iOS button links to App Store (`APP_STORE_URL`)
- `false` → iOS button opens a pre-filled email for early access

Android is not yet launched; clicking the Android button shows an inline message.

## Deployment

GitHub Pages serves the `docs/` folder from the `main` branch. Pushing to `main` is the only deploy step. The `CNAME` file in `docs/` sets the custom domain to `clinicard.fr`.
