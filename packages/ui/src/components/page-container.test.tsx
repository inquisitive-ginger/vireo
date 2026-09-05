import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageContainer, type PageWidth } from './page-container'

function frame(width: PageWidth) {
  render(
    <PageContainer width={width}>
      <span>page body</span>
    </PageContainer>
  )
  return screen.getByText('page body').parentElement as HTMLElement
}

describe('PageContainer', () => {
  it.each([
    ['prose', 'max-w-content'],
    ['list', 'max-w-list'],
    ['wide', 'max-w-wide'],
  ] as const)('gives the %s role its own measure', (width, cls) => {
    expect(frame(width)).toHaveClass(cls)
  })

  // Settings shipped at 672px WITHOUT mx-auto, quietly hugging the left edge while
  // its sibling routes sat centred. Nobody chose that; it drifted.
  it.each(['prose', 'list', 'wide'] as const)('centres the bounded %s role', (width) => {
    expect(frame(width)).toHaveClass('mx-auto')
  })

  it('leaves the full role unbounded — the dashboard grid fills the viewport', () => {
    const el = frame('full')
    expect(el).toHaveClass('w-full')
    expect(el.className).not.toMatch(/max-w-/)
  })

  it.each(['prose', 'list', 'wide', 'full'] as const)(
    'gives the %s role the one shared padding rhythm',
    (width) => {
      expect(frame(width)).toHaveClass('px-4', 'pt-4', 'pb-6', 'md:px-6', 'md:pt-6', 'md:pb-12')
    }
  )

  // The frame steps with the shell chrome, never before it: between 640 and 767
  // a `sm:` step put the desktop gutter under the mobile top bar and tab bar.
  it.each(['prose', 'list', 'wide', 'full'] as const)(
    'steps the %s role at md:, not sm:',
    (width) => {
      expect(frame(width).className).not.toMatch(/\bsm:/)
    }
  )

  // ADR 074: the frame carries no allowance for a title. Home and the calendar's
  // tablet surface render none, and were paying 40px for a header they lack.
  it('insets the top by the same step as the sides', () => {
    const el = frame('list')
    expect(el).toHaveClass('px-4', 'pt-4')
    expect(el).toHaveClass('md:px-6', 'md:pt-6')
  })

  it('lets a page extend the frame without renegotiating the gutter', () => {
    render(
      <PageContainer width="full" className="flex flex-col md:h-full">
        <span>home</span>
      </PageContainer>
    )
    const el = screen.getByText('home').parentElement as HTMLElement
    expect(el).toHaveClass('flex', 'flex-col', 'md:h-full')
    // The padding survives — className extends the frame, it does not replace it.
    expect(el).toHaveClass('px-4', 'pt-4')
  })
})
