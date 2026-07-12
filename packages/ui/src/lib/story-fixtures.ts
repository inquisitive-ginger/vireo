/**
 * Fixtures for stories only — not exported from the package index.
 *
 * These are SVG data-URI "portraits" so stories need no network. Note the irony:
 * SVG is deliberately BANNED as an avatar upload format (an SVG can carry script,
 * and served inline from our own origin that is a stored-XSS vector — see ADR 042).
 * These stand in for photographs; they are not a sample payload.
 */

type PortraitTone = 'teal' | 'warm' | 'pale' | 'group'

interface Tone {
  bg: string
  bgLight: string
  skin: string
  hair: string
  shirt: string
}

const TONES: Record<PortraitTone, Tone> = {
  /** Deliberately teal-dominant — the ADR 042 case: a photo whose colour is
   *  ANOTHER member's hue. Give this to a terracotta-hued profile to see why the
   *  identity band exists. */
  teal: { bg: '#2f6f74', bgLight: '#5fa3a6', skin: '#e8b98f', hair: '#2e2622', shirt: '#1f4f54' },
  warm: { bg: '#b5714f', bgLight: '#d99a74', skin: '#f0c9a4', hair: '#5a3a28', shirt: '#8f4f34' },
  /** Near-white — the worst case for band visibility on a light surface. */
  pale: { bg: '#e8e4dd', bgLight: '#f8f6f2', skin: '#e6bb95', hair: '#8a6a4a', shirt: '#cfc7bb' },
  group: { bg: '#6d6a63', bgLight: '#a8a49b', skin: '#e8b98f', hair: '#4a3d33', shirt: '#4f4b45' },
}

/**
 * A 2:3 portrait, like a phone photo — so a cropper genuinely has somewhere to pan
 * at zoom = 1. Explicit width/height (not just a viewBox) matters: without an
 * intrinsic size an SVG reports naturalWidth = 0 and cover-scale math collapses.
 */
export function samplePortrait(tone: PortraitTone = 'warm'): string {
  const { bg, bgLight, skin, hair, shirt } = TONES[tone]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 200 300">
  <defs><radialGradient id="g" cx="50%" cy="28%" r="80%">
    <stop offset="0%" stop-color="${bgLight}"/><stop offset="100%" stop-color="${bg}"/>
  </radialGradient></defs>
  <rect width="200" height="300" fill="url(#g)"/>
  <ellipse cx="100" cy="300" rx="78" ry="72" fill="${shirt}"/>
  <path d="M64 132a36 36 0 0 1 72 0v14a36 36 0 0 1-72 0z" fill="${skin}"/>
  <path d="M62 126a38 34 0 0 1 76 0c0 6-6 4-10-2-8 6-30 8-44 2-6 6-14 8-18 8-3 0-4-4-4-8z" fill="${hair}"/>
  <ellipse cx="86" cy="138" rx="3.5" ry="4" fill="#3b3230"/>
  <ellipse cx="114" cy="138" rx="3.5" ry="4" fill="#3b3230"/>
  <path d="M92 158q8 6 16 0" stroke="#a9736a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
