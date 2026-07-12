import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AvatarEditor, ACCEPTED_IMAGE_TYPES, AVATAR_OUTPUT_PX } from './avatar-editor'

/**
 * jsdom ships neither `createImageBitmap` nor a canvas 2D context, so both are
 * stubbed. What's worth asserting here is the behaviour we actually wrote: the
 * format gate, the EXIF decode flag, and that the export is a 512px WebP.
 */
const drawImage = vi.fn()
const toBlob = vi.fn((cb: BlobCallback) => cb(new Blob(['x'], { type: 'image/webp' })))

function imageFile(type = 'image/png', name = 'photo.png') {
  return new File(['bytes'], name, { type })
}

beforeEach(() => {
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(async () => ({ width: 400, height: 600, close: vi.fn() }) as unknown as ImageBitmap)
  )
  // Spread-stubbing `URL` would drop its static methods (they don't enumerate) —
  // patch the two we use instead.
  URL.createObjectURL = vi.fn(() => 'blob:preview')
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage,
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(toBlob)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  drawImage.mockClear()
  toBlob.mockClear()
})

function setup(props: Partial<React.ComponentProps<typeof AvatarEditor>> = {}) {
  const onSave = vi.fn()
  const onCancel = vi.fn()
  const utils = render(
    <AvatarEditor name="Zach Pritchett" onSave={onSave} onCancel={onCancel} {...props} />
  )
  return { onSave, onCancel, ...utils }
}

async function pickFile(file: File) {
  const input = screen.getByLabelText('Choose a photo', { selector: 'input' })
  fireEvent.change(input, { target: { files: [file] } })
  await waitFor(() => expect(screen.getByLabelText('Zoom')).toBeInTheDocument())
}

describe('AvatarEditor', () => {
  it('starts on the picker, not the cropper', () => {
    setup()
    expect(screen.getByText('Choose a photo')).toBeInTheDocument()
    expect(screen.queryByLabelText('Zoom')).not.toBeInTheDocument()
  })

  it('offers only the formats the server accepts — never SVG (ADR 042)', () => {
    setup()
    const input = screen.getByLabelText('Choose a photo', { selector: 'input' })
    expect(input).toHaveAttribute('accept', ACCEPTED_IMAGE_TYPES)
    expect(input.getAttribute('accept')).not.toContain('svg')
  })

  it('rejects a disallowed type without entering the cropper', async () => {
    setup()
    const input = screen.getByLabelText('Choose a photo', { selector: 'input' })
    fireEvent.change(input, { target: { files: [imageFile('image/svg+xml', 'x.svg')] } })

    expect(await screen.findByText('Choose a JPEG, PNG or WebP image.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Zoom')).not.toBeInTheDocument()
  })

  it('decodes with the EXIF orientation applied', async () => {
    setup()
    await pickFile(imageFile())

    // Without this flag every portrait phone photo lands on the canvas sideways.
    expect(createImageBitmap).toHaveBeenCalledWith(expect.any(File), {
      imageOrientation: 'from-image',
    })
  })

  it('moves to the cropper once a valid file is chosen', async () => {
    setup()
    await pickFile(imageFile('image/webp', 'p.webp'))

    expect(screen.getByLabelText('Zoom')).toHaveValue('1')
    expect(screen.getByRole('button', { name: 'Save photo' })).toBeInTheDocument()
  })

  it('renders a live preview at each size the avatar will really appear at', async () => {
    setup()
    await pickFile(imageFile())

    expect(screen.getByLabelText('Zach Pritchett at 32 pixels')).toBeInTheDocument()
    expect(screen.getByLabelText('Zach Pritchett at 40 pixels')).toBeInTheDocument()
    expect(screen.getByLabelText('Zach Pritchett at 56 pixels')).toBeInTheDocument()
  })

  it('clamps zoom to the 1–4 range', async () => {
    setup()
    await pickFile(imageFile())
    const zoom = screen.getByLabelText('Zoom')

    expect(zoom).toHaveAttribute('min', '1')
    expect(zoom).toHaveAttribute('max', '4')
  })

  it('resets zoom back to 1', async () => {
    setup()
    await pickFile(imageFile())
    const zoom = screen.getByLabelText('Zoom')

    fireEvent.change(zoom, { target: { value: '2.5' } })
    expect(zoom).toHaveValue('2.5')

    fireEvent.click(screen.getByRole('button', { name: 'Reset crop' }))
    expect(zoom).toHaveValue('1')
  })

  it('exports a 512px square WebP', async () => {
    const { onSave } = setup()
    await pickFile(imageFile())

    fireEvent.click(screen.getByRole('button', { name: 'Save photo' }))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
    const blob = onSave.mock.calls[0][0] as Blob
    expect(blob.type).toBe('image/webp')
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.9)

    // The destination rect is the full 512×512 output.
    const args = drawImage.mock.calls[0]
    expect(args.slice(-4)).toEqual([0, 0, AVATAR_OUTPUT_PX, AVATAR_OUTPUT_PX])
  })

  it('disables both actions while saving', async () => {
    setup({ saving: true })
    await pickFile(imageFile())

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('cancels from the picker', () => {
    const { onCancel } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
