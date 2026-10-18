# Roofing Giant SmartInspect — Public No-Login Demonstration

**Live:** https://roofinggiant2025.github.io/rg-smartinspect-demo/

This is a **public, static, read-only, fictional** SmartInspect walkthrough. It provides an interactive way to understand Roofing Giant's proposed inspection-to-estimate workflow without any password, emailed code, app account, upload, or CRM connection.

It is **not** the live SmartInspect application, not an inspection, not an insurance evaluation, and not a customer quote. No real property or customer data is included.

## Feature coverage (v2)

- Two independent fictional project types: a pitched residential shingle roof and a low-slope commercial TPO roof, with different conceptual roof-zone maps.
- Thirty checkpoints **per project**, reconciled into 24 example-reviewed topics, 4 hypothetical follow-up items and 2 inaccessible areas.
- Searchable/filterable inspection checkpoints with location, sample observation, real-world verification guidance, follow-up description and fictional reference IDs.
- Six evidence-reference slots per property; these are **not photographs** and clearly say so. Evidence-to-checkpoint and scope-to-evidence navigation works both ways.
- Five unpriced proposal/limitation lines per project, each linked to its originating checkpoint and relevant sample reference IDs.
- Residential manufacturer/product-family education for GAF, Owens Corning, Malarkey and CertainTeed; independent TPO educational content for the commercial case.
- Six internal QA release gates explained with no ability to sign, approve or publish.
- Guided walkthrough across Overview → Inspection → Evidence → Visual proposal → Roof systems → Quality review.
- Printer-friendly **fictional sample report**, plainly marked NOT AN INSPECTION / NOT A QUOTE.
- Direct links to project type + section, usable with browser history, keyboard-accessible tabs, and mobile-friendly navigation.
- Four plainly written FAQ entries about authenticity, pricing, privacy and unreviewed roof-system diagrams.

## Technical design and privacy

The site is static: `index.html`, `styles.css`, `data.js`, and `app.js`. No backend, login endpoint, API, cookies, forms, analytics, service worker, third-party JavaScript, database, localStorage or sessionStorage. Inputs only search the fixed sample data in the current browser tab; project/tab state may appear in the URL. External manufacturer websites are opened only when a visitor clicks their links.

GitHub Pages, like other hosts, may process standard connection logs. The site itself does not solicit or transmit personal information. It has `noindex` metadata and a restrictive browser content-security policy.

**Never** add customer photos, project addresses, real financial estimates, authentication tokens or production API credentials to this public repository. The private CRM and its technical sign-off process belong in the separately protected system.

## Accuracy boundaries

The fictional roof-zone drawings identify sample areas only; they are not installation drawings, measurements, aerial imagery or building surveys. The manufacturer selection illustrates educational catalog families, **not** qualified compatible roof assemblies. Roof-covering anatomy, ridge ventilation, special eaves, valleys, membrane installation and warranty eligibility require current manufacturer instructions, proper code consideration, and qualified professional review.

Nothing in this public demo can create/change/send an estimate, invoice, inspection, supplement, signature, work order or customer communication.

## Quality assurance

```bash
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

- `qa/content.test.mjs` validates 30-checkpoint counts, six tabs, sample-scope provenance, synthetic evidence IDs, product separation and no sensitive APIs or account forms.
- `qa/browser.cjs` runs responsive user journeys at 320px, 390px, 768px and 1440px; verifies tab navigation, cross-linked evidence, filters, printable sample report, history, keyboard accessibility and WCAG 2.1 AA checks across both project types.
- `.github/workflows/quality.yml` runs both suites automatically on pushes/pull requests to `main`.

No production database or private account is needed to run the tests.

## Deployment

GitHub Pages serves the `main` branch root at:

https://roofinggiant2025.github.io/rg-smartinspect-demo/

Changes are reviewed locally, committed and pushed only after QA succeeds. GitHub Pages building can take a minute; check the live HTML/JS/CSS and interactive functionality after deployment.

## What this DOES NOT replace

This demonstration is visually and functionally complete **for public education and product exploration**. It does not claim to be complete as a production inspection platform. Real production acceptance still requires authorized field evidence, verified measurements, pricing workflows, signed estimates, review audit records, security controls and a deployment separate from this public repo.

See `COMPLETENESS.md` for the explicit demo-vs-production acceptance register.
