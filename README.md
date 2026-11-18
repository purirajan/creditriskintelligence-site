# CreditDrishti

**Credit decisioning and risk infrastructure for US BNPL and embedded-finance lenders.**
Every credit decision comes back with the expected loss in dollars and the reasons attached.

**Live site:** [creditdrishti.com](https://creditdrishti.com) ·
[Sample decision package (PDF)](https://creditdrishti.com/sample-decision-package.pdf)

![CreditDrishti portfolio dashboard scoring 500 synthetic BNPL applications](dashboard-screenshot.png)

<sub>Portfolio dashboard scoring 500 synthetic applications (not real borrowers) with the prototype scorecard.</sub>

## What this repository is

The source of the public marketing website, served by GitHub Pages. It's plain HTML, CSS and
JavaScript, with no build step and no framework.

The product itself (scoring engine, policy engine, API and dashboard) is developed in a separate
private repository. Nothing in this repository is product code.

## What the site covers

| Section | What a visitor gets |
|---|---|
| Hero | The promise in one line, with approve and decline examples from the scoring engine |
| How it works | Application data in, decision package out: flow, API request and response |
| Product | A full sample decision package, a downloadable PDF and a dashboard screenshot |
| Expected loss | Plain-English PD, LGD, EAD and ECL, plus a calculator comparing loss with order revenue |
| Why CreditDrishti | Comparison with bureau scores, rules engines and building in-house |
| Buyer's checklist | Straight answers on integration, latency, policy control, audit records and model quality |
| Security & data | What a backtest needs, where it runs, and where the company is today |
| Backtest request | A form for lenders who want to run their own order history |

## Where things stand

CreditDrishti is an early-stage prototype. The site says so plainly:

- Example numbers come from the real scoring engine run on **synthetic** applicants.
- The scorecard uses expert-set assumptions and is **not yet calibrated** to lender data.
- There is no SOC 2 report yet, and no pre-built integrations.

Please keep it that way. Every claim on the site should be something the product does today.

## Repository layout

| Path | Purpose |
|---|---|
| `index.html` | Home page |
| `privacy.html`, `terms.html` | Privacy policy and terms of use |
| `contact.html` | General contact form (questions, privacy requests, terms) |
| `styles.css` | Styles for all pages |
| `app.js` | Example tabs, expected-loss calculator, contact topic preselect, form handler |
| `sample-decision-package.pdf` | Downloadable sample (generated, see below) |
| `og-image.png` | 1200×630 link-preview image (generated, see below) |
| `dashboard-screenshot.png` | Screenshot of the product dashboard |
| `assets-src/` | Sources and build script for the generated files |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `CNAME`, `.nojekyll` | GitHub Pages settings |

## Working on the site

**Preview locally:**

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

**Publish:** commit and push to `main`. GitHub Pages redeploys in about a minute.

Everything in this repository is public. Never commit API keys, secrets or product code.

**Rebuild the PDF and preview image** after editing anything in `assets-src/`:

```bash
bash assets-src/build.sh
```

### Keep the numbers consistent

The same example appears in several places. If the scoring engine changes, update all of them
together from fresh engine output:

| Example | Numbers |
|---|---|
| Approve (BNPL-APP-0042) | $1,200 pay-in-4 · 12-month PD 2.32% (0.29% over 6 weeks) × LGD 65% × $900 financed = **$1.71** expected loss against a $48.30 merchant fee, grade BBB |
| Counteroffer (BNPL-APP-0088) | $600 pay-in-4 · 12-month PD 27.4% · 35% down instead of 25% · **$9.94** expected loss within a $10.55 budget, grade CCC |
| Decline (BNPL-APP-0117) | $900 pay-in-4 · 12-month PD 72.5% · **$65.36** expected loss against a $15.92 budget, grade D |
| Dashboard (500 synthetic orders) | approve 90.4% · counteroffer 3.2% · decline 6.4% · expected loss $762 against $7,346 of merchant fees |

They come from the BNPL checkout policy (`POST /v1/bnpl/decision`, policy BNPL-POLICY-2026.11).
They appear in the hero tabs, the sample decision package, the API example (`index.html`), the
calculator defaults (`index.html`, `app.js`), the dashboard screenshot and its alt text,
`assets-src/sample-report.html` and `assets-src/og-card.html`. Grades use the product's AAA–D scale.

## License

© 2026 CreditDrishti. All rights reserved. The content and design of this site may not be
reused without permission. See the [terms of use](https://creditdrishti.com/terms.html).
