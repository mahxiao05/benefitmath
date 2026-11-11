# benefitmath

Site search reads `assets/search-index.js`. After adding or editing a page, rebuild it:

    python3 scripts/build-search-index.py

The small "BenefitMath › Guides › Page" trail above each page title is built from the page's BreadcrumbList data. After adding a page, refresh it:

    python3 scripts/build-breadcrumbs.py

Shared answers: numbers typed in one calculator (state, household size, age, filing status, children, yearly pay, monthly household income) fill in the others. They're saved only in the visitor's browser. The field map is the `MAP` table in `assets/site.js`; add a page's fields there to share them.

Calmer results: on calculator pages, "Show the math" starts closed and extra info cards (no dollar amount) fold into one "More about your result" box. Nothing is removed. The code is at the end of `assets/site.js`.

## Photos

Photos come from Pexels (free license). Spots are `<div data-photo="name"></div>`; the list of photos, alt text and captions is the `PHOTOS` block at the bottom of `assets/v2.js`. To host a photo ourselves (faster, never breaks): `python3 scripts/add-photo.py photo.jpg name`, then add `file:'name'` to that entry.

Cache: pages load the shared CSS/JS as `assets/v2.css?v=YYYYMMDD` (same for site, base, theme, guide). When you change one of those files, bump the date in every page so visitors get the new version right away: `sed -i 's/?v=[0-9]*/?v=NEWDATE/g' *.html`.

## Look "A · Step by step" (Nov 2026)

`assets/v3.css` and `assets/v3.js` load last on every page (new pages must link both, after v2). The CSS only overrides colors, the Atkinson Hyperlegible font and control sizes. The JS does two things:

- Homepage topic picker (`.tpick` buttons, `.tpanel` lists). Without JavaScript every topic shows.
- Step-by-step calculators: on phones, any `form.panel` with two or more `<fieldset>`s shows one fieldset at a time with Back / Next. "Show all questions" turns it off (saved per visitor).

## Merged calculators

The tax bracket, W-4 withholding, tips, overtime and senior deduction calculators were merged into `tax-refund.html`. Their old files are small forwarding pages (meta refresh + canonical, noindex) that jump to `#brackets`, `#withholding`, `#tips`, `#overtime` and `#senior`. Site search skips forwarding pages.

## Disability & retirement calculator (Nov 2026)

`benefits.html` is the third big calculator. It has three tabs: Disability benefits (OR/WA: SSI, SSDI, SNAP, Medicaid, housing), VA benefits, and Retirement & Medicare (Social Security claiming age, the 2027 COLA and 2026 Medicare premiums). `?show=ret` or `#retirement` opens the retirement tab, `?show=va` or `#va` the VA tab. The retirement tab repeats the numbers in retirement.html, cola.html and medicare-premiums.html; update them together. Those pages stay as detail pages with a link to the hub.

## Site purpose wording

The site's stated purpose (homepage, About, footers, meta descriptions): help people find out which government benefits they may qualify for, or find the specific calculator they need. Keep new pages consistent with it.
