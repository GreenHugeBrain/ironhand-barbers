import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../styles.css'
import GalleryPage from '../pages/GalleryPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GalleryPage />
  </StrictMode>,
)
