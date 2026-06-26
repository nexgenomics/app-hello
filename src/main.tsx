import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrandProvider } from '@nexgenomics/core/brand'
import { ThemeProvider } from '@nexgenomics/core/theme'
import { AuthProvider } from '@nexgenomics/core/auth'
import { brand } from './brand/brand'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

createRoot(root).render(
  <StrictMode>
    <BrandProvider brand={brand}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrandProvider>
  </StrictMode>,
)
