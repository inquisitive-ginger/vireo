#!/usr/bin/env python3
"""Normalize a generated icon: snap to the brand palette, then reframe.

Same discipline as companion-art/matte.py — the model is good at form and
unreliable at flatness and margin, so both are enforced after the fact rather
than prompted for. Flat regions snap hard to the palette (killing grain and
soft gradients); edge pixels are left alone so antialiasing survives. Then the
mark is bounding-boxed and re-composited at a fixed scale on a flat ground.

Usage: normalize.py <in.png> <out.png> [mark-fraction]
"""
import sys

from PIL import Image

# vireo-green is the brand olive lifted to L 0.70 at the SAME hue (122) — the
# bird is made of the brand colour rather than a new one, which is also why it
# does not collide with a member hue the way an amber bird would (ADR 044).
# It never abuts the ground: it lives inside the near-black aperture.
PALETTE = [(0x59, 0x6C, 0x17), (0xFB, 0xFA, 0xF4), (0xE7, 0xA0, 0x45),
           (0xB7, 0x6B, 0x27), (0x24, 0x2A, 0x0A), (0xE5, 0xE0, 0xCE),
           (0x92, 0xAA, 0x54)]
SNAP = 46      # flat-region radius; beyond it a pixel is an edge and is kept
CANVAS = 1024


def nearest(c):
    return min(PALETTE, key=lambda p: sum((a - b) ** 2 for a, b in zip(p, c)))


def main():
    src, dst = sys.argv[1], sys.argv[2]
    frac = float(sys.argv[3]) if len(sys.argv) > 3 else 0.74
    im = Image.open(src).convert("RGB").resize((CANVAS, CANVAS), Image.LANCZOS)
    px = im.load()
    w, h = im.size

    for y in range(h):
        for x in range(w):
            c = px[x, y]
            n = nearest(c)
            if sum((a - b) ** 2 for a, b in zip(n, c)) <= SNAP * SNAP:
                px[x, y] = n

    ground = px[2, 2]
    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if sum(abs(a - b) for a, b in zip(px[x, y], ground)) > 40:
                x0, y0 = min(x0, x), min(y0, y)
                x1, y1 = max(x1, x), max(y1, y)
    if x1 <= x0:
        sys.exit("no mark found in " + src)

    mark = im.crop((x0, y0, x1 + 1, y1 + 1))
    mw, mh = mark.size
    scale = (CANVAS * frac) / max(mw, mh)
    mark = mark.resize((max(1, round(mw * scale)), max(1, round(mh * scale))), Image.LANCZOS)
    out = Image.new("RGB", (CANVAS, CANVAS), ground)
    out.paste(mark, ((CANVAS - mark.size[0]) // 2, (CANVAS - mark.size[1]) // 2))
    out.save(dst)
    print(f"{dst.split('/')[-1]}  bbox {mw}x{mh} -> {mark.size[0]}x{mark.size[1]}")


if __name__ == "__main__":
    main()
