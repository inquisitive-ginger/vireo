import { useLocation } from 'react-router-dom'
import { MealsPage } from './pages/MealsPage'
import { GroceriesPage } from './pages/GroceriesPage'

// The manifest carries two routes onto ONE exposed component (ADR 032: one
// nav item per plugin) — the shell's <PluginView> renders `Plugin` for either
// path, so the plugin does its own routing off the shared router's location.
export function Plugin() {
  const location = useLocation()
  return location.pathname.startsWith('/groceries') ? <GroceriesPage /> : <MealsPage />
}

export default Plugin
