import { Routes, Route } from 'react-router-dom'
import { FeedPage } from './pages/FeedPage'

export function Plugin() {
  return (
    <Routes>
      <Route path="/family-feed" element={<FeedPage />} />
    </Routes>
  )
}

export default Plugin
