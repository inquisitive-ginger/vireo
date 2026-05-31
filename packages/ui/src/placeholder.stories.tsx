import type { Meta, StoryObj } from '@storybook/react'

function Welcome() {
  return (
    <div className="p-10 max-w-2xl font-sans">
      <h1 className="text-3xl font-bold mb-1">Family OS — Component Catalog</h1>
      <p className="text-sm text-gray-400 mb-8">Powered by Storybook 8 + Tailwind CSS v4</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">What this catalog is for</h2>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li>Develop and review <code>@family-os/ui</code> components in isolation</li>
          <li>Verify design tokens, typography, and color as the visual language is defined</li>
          <li>Provide a living canvas for design sessions before components land in the shell</li>
          <li>Plugin authors write stories for any widgets they expose</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Stack</h2>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li><strong>Components:</strong> shadcn/ui (added per feature story)</li>
          <li><strong>Styling:</strong> Tailwind CSS v4 — <code>@import "tailwindcss"</code> in <code>src/styles.css</code></li>
          <li><strong>Stories:</strong> colocated with source — <code>Component.stories.tsx</code></li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">References</h2>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li><code>docs/design-system.md</code> — visual language and component conventions</li>
          <li><code>docs/decisions/025-component-catalog-storybook.md</code> — why Storybook 8</li>
        </ul>
      </section>
    </div>
  )
}

const meta: Meta<typeof Welcome> = {
  title: 'Family OS/Welcome',
  component: Welcome,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Welcome>

export const Default: Story = {}
