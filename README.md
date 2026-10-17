# benefitmath

Site search reads `assets/search-index.js`. After adding or editing a page, rebuild it:

    python3 scripts/build-search-index.py

The small "BenefitMath › Guides › Page" trail above each page title is built from the page's BreadcrumbList data. After adding a page, refresh it:

    python3 scripts/build-breadcrumbs.py

Shared answers: numbers typed in one calculator (state, household size, age, filing status, children, yearly pay, monthly household income) fill in the others. They're saved only in the visitor's browser. The field map is the `MAP` table in `assets/site.js`; add a page's fields there to share them.
