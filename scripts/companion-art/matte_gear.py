#!/usr/bin/env python3
"""Matte generated gear: key out the magenta background, peel any die-cut
border, keep the pigment-lane colors untouched (no desaturation, no band snap).

Usage: matte_gear.py <in.png> <out.png>
"""
import sys
from collections import deque

from PIL import Image


def bg_color(px, w, h):
    cs = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]
    return tuple(sum(c[i] for c in cs) // 4 for i in range(3))


def dist(a, b):
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))


def main():
    src, dst = sys.argv[1], sys.argv[2]
    im = Image.open(src).convert("RGBA")
    im = im.resize((512, 512), Image.LANCZOS)
    px = im.load()
    w, h = im.size
    bg = bg_color(px, w, h)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            d = dist((r, g, b), bg)
            if d < 60:
                px[x, y] = (0, 0, 0, 0)
            elif d < 85:
                px[x, y] = (r, g, min(b, g + 15), a * (d - 60) // 25)
    # de-spill: magenta-cast edge pixels (r and b both well above g) get the
    # blue channel pulled back toward the item's own hue
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and r > g + 30 and b > g + 10:
                px[x, y] = (r, g, min(b, g + 15), a)
    # border peel: light pixels reachable from transparent outside
    q = deque()
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if (x in (0, w - 1) or y in (0, h - 1)) and px[x, y][3] == 0:
                q.append((x, y)); seen[y][x] = True
    peeled = 0
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]:
                r, g, b, a = px[nx, ny]
                if a == 0 or a < 120 or min(r, g, b) >= 190 or (min(r, g, b) >= 150 and r > g and b > g):
                    if a:
                        px[nx, ny] = (r, g, b, 0)
                        peeled += 1
                    seen[ny][nx] = True
                    q.append((nx, ny))
    # halo erosion only when a real border ring was peeled — otherwise it eats
    # legitimate pale edges (cream fringe)
    for _ in range(2 if peeled > 800 else 0):
        kill = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a and min(r, g, b) >= 150 and any(
                        px[nx, ny][3] == 0 for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1))):
                    kill.append((x, y))
        for x, y in kill:
            px[x, y] = (0, 0, 0, 0)
    # residue pass: 1px midtone-pink specks left where a peeled ring met the
    # background — never touches the item's dark outline (min < 110)
    for _ in range(2):
        kill = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a and r > g and b > g and min(r, g, b) >= 110 and any(
                        px[nx, ny][3] == 0 for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1))):
                    kill.append((x, y))
        for x, y in kill:
            px[x, y] = (0, 0, 0, 0)
    # despeckle: drop isolated semi-transparent islands left by the fade zone
    for _ in range(2):
        kill = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if px[x, y][3]:
                    n = sum(1 for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)) if px[nx, ny][3])
                    if n < 2:
                        kill.append((x, y))
        for x, y in kill:
            px[x, y] = (0, 0, 0, 0)
    im.save(dst)
    print(dst.split("/")[-1], "matted")


if __name__ == "__main__":
    main()
