# CreditDrishti — Website

Public marketing site, served by GitHub Pages. Plain HTML/CSS/JS, so there's no build step.

> The product code, models and internal docs live in a separate **private** repository.
> Don't copy them, or any API keys, into this repo: everything here is public.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page (hero, how it works, sample decision package, expected-loss calculator, comparison, security, backtest form) |
| `privacy.html`, `terms.html` | Privacy policy and terms of use |
| `styles.css` | Styles for all pages |
| `app.js` | Hero example tabs, expected-loss calculator, Formspree form handler |
| `sample-decision-package.pdf` | Downloadable sample decision package (synthetic data) |
| `og-image.png` | 1200×630 link-preview image |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `CNAME` | Custom domain (creditdrishti.com) |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

All example numbers on the site are illustrative and must stay internally consistent:
approve example PD 4.2% × LGD 65% × $1,200 = $32.76; decline example PD 31% × 65% × $900 = $181.35.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Demo-request form (Formspree)

1. Create a free form at https://formspree.io and copy its ID (the part after `/f/`).
2. In `index.html`, replace `YOUR_FORM_ID` in the form's `action` URL.
3. In Formspree, restrict the form to your site's domain (Settings → Restrict to domain).

## Deploy (GitHub Pages)

Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)`.
The site is published at `https://<user>.github.io/<repo>/`.

### Custom domain (optional)

Add the domain under Settings → Pages → Custom domain (this creates a `CNAME` file),
then point DNS at GitHub Pages and tick **Enforce HTTPS**.

## Adding live features later

GitHub Pages only serves static files. For anything that needs a server, host it separately
(for example, the scoring API from the private repo on Render, Fly.io or Cloud Run) and call it
from `app.js` with `fetch()`. Never put secrets in this repo's JavaScript.
