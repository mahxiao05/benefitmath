#!/usr/bin/env python3
"""Add or refresh the visible breadcrumb trail on every page, built from the page's
BreadcrumbList JSON-LD so the two always match. Run after adding a page:
   python3 scripts/build-breadcrumbs.py"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABEL = {"es": "Ruta de navegación", "zh": "页面路径"}
OLD = re.compile(r'<nav class="crumbs"[^>]*>.*?</nav>\n', re.S)

for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    s = open(path, encoding="utf-8").read()
    items = None
    for block in re.findall(r'(?s)<script type="application/ld\+json">(.*?)</script>', s):
        d = json.loads(block)
        for node in d if isinstance(d, list) else d.get("@graph", [d]):
            if node.get("@type") == "BreadcrumbList":
                items = node["itemListElement"]
    if not items:
        continue
    lang = (re.search(r'<html[^>]*lang="([a-z]+)', s) or [None, "en"])[1]
    parts = []
    for i, it in enumerate(items):
        name = html.escape(it["name"], quote=False)
        if i == len(items) - 1:
            parts.append(f'<li aria-current="page">{name}</li>')
        else:
            href = it["item"].replace("https://benefitmath.com/", "") or "./"
            parts.append(f'<li><a href="{href}">{name}</a></li>')
    nav = f'<nav class="crumbs" aria-label="{LABEL.get(lang, "Breadcrumb")}"><ol>{"".join(parts)}</ol></nav>\n'
    s = OLD.sub("", s)
    s, n = re.subn(r'(?m)^<header class="top', lambda m: nav + m.group(0), s, count=1)
    if n:
        open(path, "w", encoding="utf-8").write(s)
    else:
        print("no page header, skipped:", os.path.basename(path))
