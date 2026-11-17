# CreditRisk Intelligence — Website

Public marketing site, served by GitHub Pages. Plain HTML/CSS/JS, so there's no build step.

> The product code, models and internal docs live in a separate **private** repository.
> Don't copy them, or any API keys, into this repo: everything here is public.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page content |
| `styles.css` | Styles |
| `app.js` | Sample output panel + demo-request form handler |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

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
