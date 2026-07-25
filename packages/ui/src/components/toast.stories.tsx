import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Toast } from './toast'
import { Button } from './button'

const meta: Meta = {
  title: 'Notifications/Toast',
  parameters: { layout: 'centered' },
}
export default meta

export const Variants: StoryObj = {
  name: 'Variants — success · info · warning · error',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-ui)' }}
    >
      <Toast />
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 8 }}>
        Success auto-dismisses in 3s · Info in 5s · Warning in 8s · Error persists
      </p>
      <Button
        onClick={() =>
          toast.success('Chore completed', {
            description: 'Jordan marked "Clean room" as done',
            duration: 3000,
          })
        }
      >
        Success (3s)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Calendar reminder', {
            description: 'Soccer practice in 30 minutes',
            duration: 5000,
          })
        }
      >
        Info (5s)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Allowance low', {
            description: 'P-Bucks balance is below 10',
            duration: 8000,
          })
        }
      >
        Warning (8s)
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Plugin failed to load', { duration: Infinity })}
      >
        Error (persistent)
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          for (let i = 1; i <= 5; i++) toast.info(`Notification ${i}`)
        }}
      >
        Trigger 5 at once (max 3 visible)
      </Button>
    </div>
  ),
}
