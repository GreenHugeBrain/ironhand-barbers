import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../styles.css'
import Barbers from '../pages/Barbers.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Barbers />
  </StrictMode>,
)
