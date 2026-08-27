import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../styles.css'
import Book from '../pages/Book.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Book />
  </StrictMode>,
)
