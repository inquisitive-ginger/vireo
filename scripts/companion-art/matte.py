#!/usr/bin/env python3
"""Matte + normalize generated bodies: key out the saturated background,
desaturate what remains, snap levels toward the band contract, report bands.

Usage: matte.py <in.png> <out.png>
"""
import sys

from PIL import Image

# band contract (style-bible.md): paper 1.0 · fill 0.80 · line 0.55 · feature 0.12
BANDS = [255, 204, 140, 31]


def main():
    src, dst = sys.argv[1], sys.argv[2]
    im = Image.open(src).convert("RGBA")
    im = im.resize((512, 512), Image.LANCZOS)
    px = im.load()
    w, h = im.size
    hist = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            sat = mx - mn
            if sat > 60:  # saturated = background key
                px[x, y] = (0, 0, 0, 0)
                continue
            gray = (r * 299 + g * 587 + b * 114) // 1000
            # soft-edge pixels partially keyed by residual saturation
            alpha = a if sat <= 24 else int(a * (60 - sat) / 36)
            # snap toward the nearest contract band, keep 40% of the residual
            near = min(BANDS, key=lambda v: abs(v - gray))
            gray = int(near + (gray - near) * 0.4)
            px[x, y] = (gray, gray, gray, alpha)
            if alpha > 200:
                hist[near] = hist.get(near, 0) + 1
    # die-cut border peel: near-white reachable from transparent outside goes
    # transparent; interior paper (teeth, speculars) is sealed behind the outline
    from collections import deque
    q = deque()
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if (x in (0, w - 1) or y in (0, h - 1)) and px[x, y][3] == 0:
                q.append((x, y)); seen[y][x] = True
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]:
                r, g, b, a = px[nx, ny]
                if a == 0 or r >= 225:
                    if a and r >= 225:
                        px[nx, ny] = (r, g, b, 0)
                    seen[ny][nx] = True
                    q.append((nx, ny))
    im.save(dst)
    total = sum(hist.values()) or 1
    print(dst.split("/")[-1],
          " ".join(f"{k}:{100*v//total}%" for k, v in sorted(hist.items(), reverse=True)))


if __name__ == "__main__":
    main()
