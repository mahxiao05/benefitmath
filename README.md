# benefitmath

Site search reads `assets/search-index.js`. After adding or editing a page, rebuild it:

    python3 scripts/build-search-index.py

The small "BenefitMath › Guides › Page" trail above each page title is built from the page's BreadcrumbList data. After adding a page, refresh it:

    python3 scripts/build-breadcrumbs.py
