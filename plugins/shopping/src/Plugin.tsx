import { useLocation } from 'react-router-dom'
import { ShoppingPage } from './pages/ShoppingPage'
import { WallPage } from './pages/WallPage'

/* Two surfaces, one plugin and one nav entry (ADR 032): `/shopping` is the
   phone/tablet list, `/shopping/wall` is W2 — the fridge tablet, which only
   takes things in. Separate routes rather than one route branching on the
   family profile, so the wall is reachable and reviewable from any device; the
   wall still ADDS as the family profile, which is ADR 072 and is a fact about
   the request, not about the URL.

   A pathname test rather than a nested `<Routes>`: the shell registers each
   manifest route as an exact path, so there is no splat above this to match
   against. */
export function Plugin() {
  const { pathname } = useLocation()
  return pathname.startsWith('/shopping/wall') ? <WallPage /> : <ShoppingPage />
}

export default Plugin
