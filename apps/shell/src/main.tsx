import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import { App } from './App'
import { Home } from './pages/Home'
import { DemoPage } from './pages/DemoPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Pathless layout route — App (sidebar + outlet) renders for every URL.
            The path="*" catch-all child ensures the layout renders even when no
            named route matches (e.g. /settings before that story is built). */}
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="*" element={null} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
