import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'

// AllProviders grows as stories implement AuthProvider, QueryClientProvider, etc.
function AllProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}
