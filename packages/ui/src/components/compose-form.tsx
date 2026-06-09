import { useState } from 'react'
import { Button } from './button'
import { ProfileAvatar } from './profile-avatar'
import { Textarea } from './textarea'

export interface ComposeFormProps {
  onSubmit: (body: string) => void | Promise<void>
  onCancel: () => void
  authorName?: string
  defaultValue?: string
}

export function ComposeForm({
  onSubmit,
  onCancel,
  authorName = 'You',
  defaultValue = '',
}: ComposeFormProps) {
  const [body, setBody] = useState(defaultValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    const trimmed = body.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(trimmed)
      setBody('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        background: 'var(--secondary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px 18px',
        boxShadow: '0 2px 8px oklch(0 0 0 / 0.06)',
      }}
    >
      <div className="flex gap-3 items-start">
        <ProfileAvatar name={authorName} size="sm" />
        <Textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share something with the family…"
          rows={3}
          disabled={isSubmitting}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 py-1 text-base"
        />
      </div>
      <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || isSubmitting}>
          {isSubmitting ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </div>
  )
}
