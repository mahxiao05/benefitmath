# benefitmath

Site search reads `assets/search-index.js`. After adding or editing a page, rebuild it:

    python3 scripts/build-search-index.py

The small "BenefitMath › Guides › Page" trail above each page title is built from the page's BreadcrumbList data. After adding a page, refresh it:

    python3 scripts/build-breadcrumbs.py

Shared answers: numbers typed in one calculator (state, household size, age, filing status, children, yearly pay, monthly household income) fill in the others. They're saved only in the visitor's browser. The field map is the `MAP` table in `assets/site.js`; add a page's fields there to share them.

Calmer results: on calculator pages, "Show the math" starts closed and extra info cards (no dollar amount) fold into one "More about your result" box. Nothing is removed. The code is at the end of `assets/site.js`.

## Photos

Photos come from Pexels (free license). Spots are `<div data-photo="name"></div>`; the list of photos, alt text and captions is the `PHOTOS` block at the bottom of `assets/v2.js`. To host a photo ourselves (faster, never breaks): `python3 scripts/add-photo.py photo.jpg name`, then add `file:'name'` to that entry.
