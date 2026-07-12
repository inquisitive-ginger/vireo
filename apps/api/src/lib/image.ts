import { createHash } from 'node:crypto'

/**
 * Formats an avatar may be stored in (ADR 042).
 *
 * SVG is deliberately absent and must stay absent: an SVG can carry <script>, and
 * served inline from our own origin that is a stored-XSS vector. This is why the
 * type is derived from the BYTES rather than trusted from the client's
 * Content-Type or a filename extension.
 */
export const ALLOWED_IMAGE_MIME = ['image/webp', 'image/png', 'image/jpeg'] as const
export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number]

/** Hard cap on stored avatar bytes. The client crops to a 512px WebP (~40KB), so
 *  this is generous headroom, not a target. */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

/**
 * Identify an image by its magic bytes. Returns null for anything not on the
 * whitelist — including SVG, which has no magic number and would otherwise sneak
 * through any signature-based check that defaulted to "allow".
 */
export function sniffImageMime(buf: Buffer): AllowedImageMime | null {
  // PNG — 89 50 4E 47 0D 0A 1A 0A
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'image/png'
  }

  // JPEG — starts FF D8 FF, ends FF D9
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg'
  }

  // WebP — "RIFF" ....  "WEBP"
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp'
  }

  return null
}

/** Content hash — the `?v=` that busts the immutable cache when a photo changes. */
export function imageHash(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16)
}

/** The URL stored on `Profile.avatarUrl`. Immutable per hash. */
export function avatarUrl(profileId: string, hash: string): string {
  return `/api/profiles/${profileId}/avatar?v=${hash}`
}
