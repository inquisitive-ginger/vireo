#!/usr/bin/env python3
"""Contact sheet for an icon batch: every candidate at the sizes that decide it.

Usage: sheet.py <dir-of-pngs> <out.png>
"""
import os
import sys

from PIL import Image, ImageDraw

SIZES = [256, 64, 48, 32, 16]
PAD, GAP, LABEL = 28, 22, 92
GROUND = (233, 231, 222)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    names = sorted(f for f in os.listdir(src) if f.endswith(".png"))
    if not names:
        sys.exit("no pngs in " + src)
    row_h = SIZES[0] + GAP
    w = PAD * 2 + LABEL + sum(SIZES) + GAP * len(SIZES)
    h = PAD * 2 + row_h * len(names)
    sheet = Image.new("RGB", (w, h), GROUND)
    d = ImageDraw.Draw(sheet)
    for i, n in enumerate(names):
        im = Image.open(os.path.join(src, n)).convert("RGB")
        y = PAD + i * row_h
        d.text((PAD, y + SIZES[0] // 2), n[:-4], fill=(40, 40, 36))
        x = PAD + LABEL
        for s in SIZES:
            sheet.paste(im.resize((s, s), Image.LANCZOS), (x, y + (SIZES[0] - s) // 2))
            x += s + GAP
    sheet.save(dst)
    print(dst, sheet.size, len(names), "candidates")


if __name__ == "__main__":
    main()
