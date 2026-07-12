import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'
import { ImageUp, RotateCcw } from 'lucide-react'
import { Button } from './button'
import { type ProfileAvatarSize } from './profile-avatar'
import { cn } from '../lib/utils'

/** Square edge of the exported image, in px. */
export const AVATAR_OUTPUT_PX = 512
/** Formats the server will accept (ADR 042 — SVG is deliberately excluded). */
export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
/** The sizes the crop will actually be seen at — that is where a bad crop shows up. */
const PREVIEW_SIZES: ProfileAvatarSize[] = ['sm', 'base', 'md']

export interface AvatarEditorProps {
  /** Name — labels the preview circles. The editor paints no identity hue: a photo
   *  is a face, and the hue lives on the chrome beside the avatar (ADR 042). */
  name: string
  /** Called with the cropped 512×512 WebP. */
  onSave: (blob: Blob) => void
  onCancel: () => void
  /** Diameter of the crop circle. */
  viewport?: number
  saving?: boolean
  className?: string
}

/**
 * Pan + zoom + circular crop, exporting a square WebP encoded on the client.
 *
 * Built on `@use-gesture/react` (already a dependency) rather than `react-easy-crop`:
 * the differentiated part of a cropper is the frame, not the pan math (ADR 042).
 *
 * Cropping client-side means the server never needs `sharp` and receives ~40KB
 * instead of a 4MB phone photo — but the server still must not trust the result
 * (magic-byte sniff + byte cap live on the route).
 */
export function AvatarEditor({
  name,
  onSave,
  onCancel,
  viewport = 320,
  saving = false,
  className,
}: AvatarEditorProps) {
  const [src, setSrc] = useState<string | null>(null)
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  // Revoke the object URL when it is replaced or the editor unmounts.
  useEffect(() => {
    return () => {
      if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
    }
  }, [src])

  const natural = useMemo(() => ({ w: bitmap?.width ?? 0, h: bitmap?.height ?? 0 }), [bitmap])

  /** The image is first scaled to COVER the square viewport; zoom multiplies that. */
  const coverScale = useMemo(
    () => (natural.w && natural.h ? Math.max(viewport / natural.w, viewport / natural.h) : 1),
    [natural, viewport]
  )

  /** Clamp the pan so the image can never be dragged off the crop square. */
  const clamp = useCallback(
    (p: { x: number; y: number }, z: number) => {
      const mx = Math.max(0, (natural.w * coverScale * z - viewport) / 2)
      const my = Math.max(0, (natural.h * coverScale * z - viewport) / 2)
      return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) }
    },
    [natural, coverScale, viewport]
  )

  const setZoomClamped = useCallback(
    (z: number) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
      setZoom(next)
      setPos((p) => clamp(p, next))
    },
    [clamp]
  )

  async function loadFile(file: File) {
    setError(null)
    if (!ACCEPTED_IMAGE_TYPES.split(',').includes(file.type)) {
      setError('Choose a JPEG, PNG or WebP image.')
      return
    }
    try {
      // `imageOrientation: 'from-image'` applies the EXIF rotation. Without it every
      // photo taken in portrait on a phone lands on the canvas sideways.
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
      if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
      setBitmap(bmp)
      setSrc(URL.createObjectURL(file))
      setZoom(MIN_ZOOM)
      setPos({ x: 0, y: 0 })
    } catch {
      setError("That image couldn't be read.")
    }
  }

  const bind = useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => setPos((p) => clamp({ x: p.x + dx, y: p.y + dy }, zoom)),
      onPinch: ({ offset: [s] }) => setZoomClamped(s),
      onWheel: ({ delta: [, dy] }) => setZoomClamped(zoom - dy * 0.003),
    },
    { drag: { filterTaps: true }, pinch: { scaleBounds: { min: MIN_ZOOM, max: MAX_ZOOM } } }
  )

  function handleSave() {
    if (!bitmap) return
    const canvas = document.createElement('canvas')
    canvas.width = AVATAR_OUTPUT_PX
    canvas.height = AVATAR_OUTPUT_PX
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Map the viewport square back into the image's natural coordinate space.
    const eff = coverScale * zoom
    const half = viewport / 2 / eff
    const cx = natural.w / 2 - pos.x / eff
    const cy = natural.h / 2 - pos.y / eff
    ctx.drawImage(
      bitmap,
      cx - half,
      cy - half,
      half * 2,
      half * 2,
      0,
      0,
      AVATAR_OUTPUT_PX,
      AVATAR_OUTPUT_PX
    )
    canvas.toBlob((blob) => blob && onSave(blob), 'image/webp', 0.9)
  }

  // ─── Empty state — pick a file ──────────────────────────────────────────────
  if (!src) {
    return (
      <div className={cn('flex flex-col items-center gap-5', className)}>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) void loadFile(file)
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-full border-2 border-dashed transition-colors',
            'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          style={{ width: viewport, height: viewport }}
        >
          <ImageUp className="size-8 text-muted-foreground" />
          <span className="text-sm-token font-medium">Choose a photo</span>
          <span className="text-xs-body max-w-[24ch] text-center text-muted-foreground">
            or drag one here — JPEG, PNG or WebP
          </span>
        </button>

        {error && <p className="text-sm-token text-destructive">{error}</p>}

        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          aria-label="Choose a photo"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void loadFile(file)
            e.target.value = ''
          }}
        />

        <Button variant="outline" className="w-full max-w-[320px]" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    )
  }

  // ─── Crop state ─────────────────────────────────────────────────────────────
  return (
    <div className={cn('flex flex-col items-center gap-5', className)}>
      <div
        {...bind()}
        role="application"
        aria-label="Drag to reposition, pinch or scroll to zoom"
        className="relative shrink-0 cursor-grab touch-none overflow-hidden rounded-full ring-4 ring-border active:cursor-grabbing"
        style={{ width: viewport, height: viewport }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
          style={{
            width: natural.w * coverScale,
            height: natural.h * coverScale,
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
          }}
        />
      </div>

      <div className="flex w-full max-w-[320px] items-center gap-3">
        <span className="text-xs-body w-10 shrink-0 text-muted-foreground">Zoom</span>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          aria-label="Zoom"
          onChange={(e) => setZoomClamped(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
        />
        <Button
          variant="ghost"
          size="sm"
          aria-label="Reset crop"
          className="size-8 shrink-0 p-0"
          onClick={() => {
            setZoom(MIN_ZOOM)
            setPos({ x: 0, y: 0 })
          }}
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>

      {/* Judge the crop at the sizes it will really render — a face that survives
          at 56px can still be unreadable at 32px in the calendar owner stack. */}
      <div className="flex items-center gap-4 rounded-card bg-surface-sunken px-5 py-3 shadow-[var(--shadow-inset)]">
        <span className="text-xs-body shrink-0 text-muted-foreground">Preview</span>
        {PREVIEW_SIZES.map((s) => (
          <CropPreview
            key={s}
            src={src}
            size={s}
            name={name}
            zoom={zoom}
            pos={pos}
            viewport={viewport}
            natural={natural}
            coverScale={coverScale}
          />
        ))}
      </div>

      <div className="flex w-full max-w-[320px] gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save photo'}
        </Button>
      </div>
    </div>
  )
}

/**
 * Mirrors the crop transform into a small circle — pure CSS, no canvas, so it
 * tracks the drag live. The photo fills the circle, exactly as `ProfileAvatar`
 * will render it: the preview's whole job is fidelity, so it carries no chrome the
 * real avatar does not have.
 */
function CropPreview({
  src,
  size,
  name,
  zoom,
  pos,
  viewport,
  natural,
  coverScale,
}: {
  src: string
  size: ProfileAvatarSize
  name: string
  zoom: number
  pos: { x: number; y: number }
  viewport: number
  natural: { w: number; h: number }
  coverScale: number
}) {
  const px = { sm: 32, base: 40, md: 56, lg: 80 }[size]
  const k = px / viewport

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        role="img"
        aria-label={`${name} at ${px} pixels`}
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: px, height: px }}
      >
        <img
          src={src}
          alt=""
          className="absolute left-1/2 top-1/2 max-w-none"
          style={{
            width: natural.w * coverScale * k,
            height: natural.h * coverScale * k,
            transform: `translate(-50%, -50%) translate(${pos.x * k}px, ${pos.y * k}px) scale(${zoom})`,
          }}
        />
      </div>
      <span className="text-xs-body text-muted-foreground">{px}</span>
    </div>
  )
}
