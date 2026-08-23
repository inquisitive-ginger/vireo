import { useLocation } from 'react-router-dom'
import { MealsPage } from './pages/MealsPage'
import { GroceriesIndexPage } from './pages/GroceriesIndexPage'
import { GroceryListPage } from './pages/GroceryListPage'

// The manifest carries two routes onto ONE exposed component (ADR 032: one
// nav item per plugin) — the shell's <PluginView> renders `Plugin` for either
// path, so the plugin does its own routing off the shared router's location.
// The manifest declares `/groceries/*` (a wildcard — the shell registers each
// route exactly, main.tsx:125), so the drill-in URL is real: `/groceries/:id`
// reaches this component too, and the id is read off the location rather than
// kept in component state — a reload or a shared link lands on the same list.
export function Plugin() {
  const location = useLocation()
  if (location.pathname.startsWith('/groceries')) {
    const listId = location.pathname.match(/^\/groceries\/([^/]+)\/?$/)?.[1]
    return listId ? <GroceryListPage listId={listId} /> : <GroceriesIndexPage />
  }
  return <MealsPage />
}

export default Plugin
