#!/usr/bin/env python3
"""Trace flat palette art to SVG.

The generated master is already quantized to a handful of flat brand colours, so
it does not need a general-purpose autotracer — every region is a solid colour
whose boundary sits exactly on the pixel lattice. This walks that lattice, chains
the boundary edges into closed loops, simplifies them, and emits one even-odd
path per colour. Exact where a curve-fitter would guess, and it keeps the trace
honest: the vector is the art, not an interpretation of it.

Usage: trace.py <flat.png> <out.svg> [epsilon]
"""
import sys
from collections import defaultdict, deque

from PIL import Image

PALETTE = [
    ("#596C17", (0x59, 0x6C, 0x17)),   # ground — emitted as the backing rect
    ("#FBFAF4", (0xFB, 0xFA, 0xF4)),
    ("#E5E0CE", (0xE5, 0xE0, 0xCE)),
    ("#E7A045", (0xE7, 0xA0, 0x45)),
    ("#B76B27", (0xB7, 0x6B, 0x27)),
    ("#92AA54", (0x92, 0xAA, 0x54)),
    ("#242A0A", (0x24, 0x2A, 0x0A)),
]
MIN_LOOP_AREA = 40.0   # drops antialiasing specks; a real region is far larger
CONFIDENT = 40         # RGB distance within which a pixel claims a palette colour


def dp(pts, eps):
    """Douglas-Peucker on a closed ring."""
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        n = (dx * dx + dy * dy) ** 0.5
        best, bi = -1.0, i
        for k in range(i + 1, j):
            px, py = pts[k]
            d = (abs(dy * px - dx * py + bx * ay - by * ax) / n) if n else \
                ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
            if d > best:
                best, bi = d, k
        if best > eps:
            keep[bi] = True
            stack.append((i, bi))
            stack.append((bi, j))
    return [p for p, k in zip(pts, keep) if k]


def area(ring):
    a = 0.0
    for i in range(len(ring) - 1):
        x0, y0 = ring[i]
        x1, y1 = ring[i + 1]
        a += x0 * y1 - x1 * y0
    return abs(a) / 2


def loops_of(mask, w, h, eps):
    """All boundary loops of a binary mask, as simplified rings."""
    out = defaultdict(list)
    for i in mask:
        y, x = divmod(i, w)
        if y == 0 or (i - w) not in mask:
            out[(x, y)].append((x + 1, y))
        if x == w - 1 or (i + 1) not in mask:
            out[(x + 1, y)].append((x + 1, y + 1))
        if y == h - 1 or (i + w) not in mask:
            out[(x + 1, y + 1)].append((x, y + 1))
        if x == 0 or (i - 1) not in mask:
            out[(x, y + 1)].append((x, y))

    rings = []
    while out:
        start = next(iter(out))
        ring, cur = [start], start
        while True:
            nxt = out[cur].pop()
            if not out[cur]:
                del out[cur]
            ring.append(nxt)
            cur = nxt
            if cur == start or cur not in out:
                break
        if area(ring) >= MIN_LOOP_AREA:
            r = dp(ring, eps)
            if len(r) >= 4:
                rings.append(r)
    return rings


def main():
    src, dst = sys.argv[1], sys.argv[2]
    eps = float(sys.argv[3]) if len(sys.argv) > 3 else 1.4
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = list(im.getdata())

    # Assigning every pixel to its NEAREST palette colour is wrong at the edges:
    # an antialiased cream-over-olive pixel passes close to the pale grey, so the
    # silhouette grows a fringe of phantom regions. Instead only confident pixels
    # claim a colour, and the ambiguous edge band is flood-filled outward from
    # them — an edge pixel inherits the region it actually borders.
    label = [None] * len(px)
    queue = deque()
    for i, c in enumerate(px):
        hexcode, ref = min(PALETTE, key=lambda p: sum((a - b) ** 2 for a, b in zip(p[1], c)))
        if sum((a - b) ** 2 for a, b in zip(ref, c)) <= CONFIDENT * CONFIDENT:
            label[i] = hexcode
            queue.append(i)
    while queue:
        i = queue.popleft()
        y, x = divmod(i, w)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                j = ny * w + nx
                if label[j] is None:
                    label[j] = label[i]
                    queue.append(j)

    buckets = defaultdict(set)
    for i, hexcode in enumerate(label):
        buckets[hexcode].add(i)

    parts = [f'<rect width="{w}" height="{h}" fill="{PALETTE[0][0]}"/>']
    for hexcode, _ in PALETTE[1:]:
        mask = buckets.get(hexcode)
        if not mask:
            continue
        rings = loops_of(mask, w, h, eps)
        if not rings:
            continue
        d = " ".join("M" + " ".join(f"{x} {y}" for x, y in r) + "Z" for r in rings)
        parts.append(f'<path fill="{hexcode}" fill-rule="evenodd" d="{d}"/>')
        print(f"  {hexcode}  {len(rings)} loop(s), {sum(len(r) for r in rings)} points")

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w}" height="{h}">\n  ' + "\n  ".join(parts) + "\n</svg>\n")
    open(dst, "w").write(svg)
    print(f"{dst}  {len(svg) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
