import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Toast } from '@family-os/ui'

export function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}
