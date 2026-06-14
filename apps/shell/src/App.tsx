import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import type { PluginNavItem } from '@/components/Sidebar'
import { Toast } from '@family-os/ui'

export function App({ pluginNavItems = [] }: { pluginNavItems?: PluginNavItem[] }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar pluginNavItems={pluginNavItems} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}
