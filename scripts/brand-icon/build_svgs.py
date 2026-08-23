#!/usr/bin/env python3
"""Derive maskable / badge / favicon masters from the traced icon.

All four masters come from one trace so they cannot drift apart. Only the
favicon substitutes geometry, and only for the aperture: at 16-32 px the four
birds are an unreadable mass, so the small end drops them and redraws the
opening as clean circles fitted to the traced ring.

Usage: build_svgs.py            (reads/writes scripts/brand-icon/svg/)
"""
import os
import re
import sys

SVG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")

GROUND = "#596C17"
HOUSE = "#FBFAF4"
BREAST = "#E5E0CE"
HEARTH = "#E7A045"
PERCH = "#B76B27"
VIREO = "#92AA54"
HOLLOW = "#242A0A"

# Fraction the mark is scaled to so it clears Android's 80 % safe circle. The
# mark's corners sit near its bounding box, so the limit is the half-diagonal,
# not the half-width.
SAFE = 0.76
# Loops smaller than this are the bills and the eyes — detail the favicon drops.
FAVICON_MIN_AREA = 6000


def layers(svg):
    return re.findall(r'<path fill="(#[0-9A-F]{6})" fill-rule="evenodd" d="([^"]+)"/>', svg)


def rings(d):
    return [r for r in d.split("M") if r.strip()]


def ring_area(r):
    nums = list(map(float, r.replace("Z", " ").split()))
    pts = list(zip(nums[0::2], nums[1::2]))
    a = 0.0
    for i in range(len(pts)):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % len(pts)]
        a += x0 * y1 - x1 * y0
    return abs(a) / 2


def bbox(d):
    nums = list(map(float, d.replace("M", " ").replace("Z", " ").split()))
    xs, ys = nums[0::2], nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)


def wrap(body, size, extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
            f'width="{size}" height="{size}">{extra}\n  ' + "\n  ".join(body) + "\n</svg>\n")


def main():
    icon = open(os.path.join(SVG, "icon.svg")).read()
    size = int(re.search(r'viewBox="0 0 (\d+)', icon).group(1))
    ls = layers(icon)
    by = dict(ls)

    # ── maskable ───────────────────────────────────────────────────────────
    c = size / 2
    inner = "\n    ".join(f'<path fill="{f}" fill-rule="evenodd" d="{d}"/>' for f, d in ls)
    maskable = wrap([
        f'<rect width="{size}" height="{size}" fill="{GROUND}"/>',
        f'<g transform="translate({c} {c}) scale({SAFE}) translate({-c} {-c})">\n    '
        f'{inner}\n  </g>',
    ], size)
    open(os.path.join(SVG, "maskable.svg"), "w").write(maskable)

    # ── badge ──────────────────────────────────────────────────────────────
    # Android keeps only the alpha channel and tints it, so this is a stencil:
    # the mark's silhouette with the opening, the eyes and the perch knocked
    # back out. Painted in the icon's own z-order, so the regions cannot fight.
    knock = {HOLLOW, PERCH}
    stencil = "\n      ".join(
        f'<path fill="{"#000" if f in knock else "#fff"}" fill-rule="evenodd" d="{d}"/>'
        for f, d in ls)
    badge = wrap([
        f'<mask id="badge">\n      <rect width="{size}" height="{size}" fill="#000"/>\n'
        f'      {stencil}\n    </mask>',
        f'<rect width="{size}" height="{size}" fill="#fff" mask="url(#badge)"/>',
    ], size)
    open(os.path.join(SVG, "badge.svg"), "w").write(badge)

    # ── favicon ────────────────────────────────────────────────────────────
    # House and perch are the traced ones, so the small mark is the large mark's
    # own geometry. The aperture is redrawn: the traced opening is pierced by the
    # birds, and dropping them would leave bird-shaped holes onto the ground.
    x0, y0, x1, y1 = bbox(by[HEARTH])
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    r_out = (x1 - x0) / 2
    ix0, iy0, ix1, iy1 = bbox(by[HOLLOW])
    r_in = min((ix1 - ix0), (iy1 - iy0)) / 2

    def big(fill):
        keep = [r for r in rings(by[fill]) if ring_area(r) >= FAVICON_MIN_AREA]
        return "M" + "M".join(keep) if keep else ""

    favicon = wrap([
        f'<rect width="{size}" height="{size}" fill="{GROUND}"/>',
        f'<path fill="{HOUSE}" fill-rule="evenodd" d="{big(HOUSE)}"/>',
        f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r_out:.0f}" fill="{HEARTH}"/>',
        f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r_in:.0f}" fill="{HOLLOW}"/>',
        f'<path fill="{PERCH}" fill-rule="evenodd" d="{big(PERCH)}"/>',
    ], size)
    open(os.path.join(SVG, "favicon.svg"), "w").write(favicon)

    for n in ("icon.svg", "maskable.svg", "badge.svg", "favicon.svg"):
        p = os.path.join(SVG, n)
        print(f"  {n:14} {os.path.getsize(p) / 1024:5.1f} KB")
    print(f"aperture: centre ({cx:.0f}, {cy:.0f})  ring r={r_out:.0f}  hollow r={r_in:.0f}")


if __name__ == "__main__":
    sys.exit(main())
