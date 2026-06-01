import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'
import type { Profile } from '@family-os/platform'
import { MockAuthProvider } from './MockAuthProvider'
import { createProfile } from './factories'

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  profile?: Profile
}

export function renderWithProviders(ui: ReactElement, options?: RenderWithProvidersOptions) {
  const { profile = createProfile(1), ...renderOptions } = options ?? {}

  function AllProviders({ children }: { children: React.ReactNode }) {
    return <MockAuthProvider profile={profile}>{children}</MockAuthProvider>
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions })
}
