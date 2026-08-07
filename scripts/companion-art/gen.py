#!/usr/bin/env python3
"""Generate companion reference candidates via Gemini image API.

Usage: gen.py <outdir> <jobs.json>
jobs.json: [{"name": "A-whisp", "prompt": "..."}, ...]
Skips files that already exist (re-run = only failures redo).
"""
import base64
import json
import os
import sys
import time
import urllib.request

MODEL = os.environ.get("GEN_MODEL", "gemini-3-pro-image")
KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}"


def generate(prompt, ref_images=None):
    parts = [{"text": prompt}]
    for p in ref_images or []:
        with open(p, "rb") as f:
            parts.append({"inlineData": {"mimeType": "image/png",
                                         "data": base64.b64encode(f.read()).decode()}})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"],
                             "imageConfig": {"aspectRatio": "1:1"}},
    }
    req = urllib.request.Request(URL, json.dumps(body).encode(),
                                 {"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        d = json.load(r)
    for part in d["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    raise RuntimeError("no image in response: " + json.dumps(d)[:300])


def main():
    outdir, jobsfile = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    jobs = json.load(open(jobsfile))
    failures = []
    for j in jobs:
        out = os.path.join(outdir, j["name"] + ".png")
        if os.path.exists(out):
            print("skip", j["name"])
            continue
        for attempt in range(3):
            try:
                png = generate(j["prompt"], j.get("refs"))
                open(out, "wb").write(png)
                print("ok  ", j["name"], len(png), "bytes")
                break
            except Exception as e:
                print("err ", j["name"], "attempt", attempt + 1, repr(e)[:200])
                time.sleep(8 * (attempt + 1))
        else:
            failures.append(j["name"])
    if failures:
        print("FAILED:", ", ".join(failures))
        sys.exit(1)


if __name__ == "__main__":
    main()
