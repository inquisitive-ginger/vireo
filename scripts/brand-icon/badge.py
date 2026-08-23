#!/usr/bin/env python3
"""Derive the Android notification badge from a normalized icon.

Android keeps only the alpha channel and tints it, so the badge is a stencil,
not a picture: the mark's silhouette with the entry hole knocked back out. Both
are already encoded in the art — the ground colour marks what is outside the
mark, the hollow marks what is inside the opening — so the stencil is derived
rather than redrawn, and cannot drift from the icon it belongs to.

Usage: badge.py <normalized.png> <out.png> [size]
"""
import sys

from PIL import Image

HOLLOW = (0x24, 0x2A, 0x0A)
TOL = 60


def close(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) < TOL


def main():
    src, dst = sys.argv[1], sys.argv[2]
    size = int(sys.argv[3]) if len(sys.argv) > 3 else 72
    im = Image.open(src).convert("RGB")
    px = im.load()
    w, h = im.size
    ground = px[2, 2]
    out = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            c = px[x, y]
            if close(c, ground) or close(c, HOLLOW):
                continue
            op[x, y] = (255, 255, 255, 255)
    # Trim to the stencil and rescale to the badge box with a small margin.
    bbox = out.getbbox()
    if not bbox:
        sys.exit("empty stencil: " + src)
    mark = out.crop(bbox)
    inner = int(size * 0.92)
    scale = inner / max(mark.size)
    mark = mark.resize((max(1, round(mark.size[0] * scale)),
                        max(1, round(mark.size[1] * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    canvas.paste(mark, ((size - mark.size[0]) // 2, (size - mark.size[1]) // 2))
    canvas.save(dst)
    print(f"{dst.split('/')[-1]}  stencil {mark.size[0]}x{mark.size[1]} in {size}px")


if __name__ == "__main__":
    main()
