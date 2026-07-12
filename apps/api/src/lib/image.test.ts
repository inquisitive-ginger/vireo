import { describe, it, expect } from 'vitest'
import { sniffImageMime, imageHash, avatarUrl, MAX_IMAGE_BYTES } from './image'

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00])
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
const WEBP = Buffer.concat([
  Buffer.from('RIFF', 'ascii'),
  Buffer.from([0x1a, 0x00, 0x00, 0x00]),
  Buffer.from('WEBP', 'ascii'),
  Buffer.from([0x56, 0x50, 0x38]),
])

describe('sniffImageMime', () => {
  it('identifies PNG, JPEG and WebP by their magic bytes', () => {
    expect(sniffImageMime(PNG)).toBe('image/png')
    expect(sniffImageMime(JPEG)).toBe('image/jpeg')
    expect(sniffImageMime(WEBP)).toBe('image/webp')
  })

  it('rejects SVG — it can carry script, and we serve from our own origin (ADR 042)', () => {
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
    )
    expect(sniffImageMime(svg)).toBeNull()
  })

  it('rejects HTML dressed up as an image', () => {
    expect(sniffImageMime(Buffer.from('<!doctype html><script>alert(1)</script>'))).toBeNull()
  })

  it('rejects a RIFF container that is not WebP (e.g. a WAV)', () => {
    const wav = Buffer.concat([
      Buffer.from('RIFF', 'ascii'),
      Buffer.from([0x1a, 0x00, 0x00, 0x00]),
      Buffer.from('WAVE', 'ascii'),
    ])
    expect(sniffImageMime(wav)).toBeNull()
  })

  it('rejects empty and truncated buffers rather than throwing', () => {
    expect(sniffImageMime(Buffer.alloc(0))).toBeNull()
    expect(sniffImageMime(Buffer.from([0x89, 0x50]))).toBeNull()
    expect(sniffImageMime(Buffer.from('RIFF', 'ascii'))).toBeNull()
  })

  it('ignores a valid signature that appears after the start of the buffer', () => {
    const smuggled = Buffer.concat([Buffer.from('<script>'), PNG])
    expect(sniffImageMime(smuggled)).toBeNull()
  })
})

describe('imageHash', () => {
  it('is stable for identical bytes and differs for different bytes', () => {
    expect(imageHash(PNG)).toBe(imageHash(Buffer.from(PNG)))
    expect(imageHash(PNG)).not.toBe(imageHash(JPEG))
  })
})

describe('avatarUrl', () => {
  it('carries the hash so an immutable cache busts when the photo changes', () => {
    expect(avatarUrl('seed-child-1', 'abc123')).toBe('/api/profiles/seed-child-1/avatar?v=abc123')
  })
})

describe('MAX_IMAGE_BYTES', () => {
  it('leaves generous headroom over a 512px WebP (~40KB)', () => {
    expect(MAX_IMAGE_BYTES).toBe(2 * 1024 * 1024)
  })
})
