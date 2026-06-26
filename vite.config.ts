import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Distinct dev port from the testbed so both can run; strictPort fails loudly
// rather than drifting to a port that is not an allow-listed Auth0 callback.
// This origin (and the production edge origin) must be added to the Auth0 SPA
// app and the gateway CORS allowlist — see @nexgenomics/core/config and the README.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: 'localhost', port: 22002, strictPort: true },
  preview: { host: 'localhost', port: 22002, strictPort: true },
})
