#!/usr/bin/env python3
"""Turn a downloaded photo into the site's two WebP sizes.
   python3 scripts/add-photo.py ~/Downloads/pexels-photo.jpg mountain
writes assets/photos/mountain-640.webp and mountain-1200.webp. Then in assets/v2.js set
file:'mountain' on that photo's PHOTOS entry so the site uses our copy instead of Pexels'."""
import os, sys
from PIL import Image, ImageOps

src, name = sys.argv[1], sys.argv[2]
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "photos")
os.makedirs(out, exist_ok=True)
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
for w in (640, 1200):
    h = round(im.height * w / im.width)
    p = os.path.join(out, f"{name}-{w}.webp")
    im.resize((w, h), Image.LANCZOS).save(p, "WEBP", quality=72, method=6)
    print(p, os.path.getsize(p) // 1024, "KB")
