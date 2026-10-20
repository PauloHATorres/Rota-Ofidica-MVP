import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vercelPwaManifest = {
  name: 'vercel-pwa-manifest',
  generateBundle() {
    if (!process.env.VERCEL) return
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.webmanifest',
      source: JSON.stringify({
        name: 'Rota Ofídica',
        short_name: 'Rota Ofídica',
        start_url: '/#/',
        scope: '/',
        display: 'standalone',
        background_color: '#F7F8F5',
        theme_color: '#164A3A',
        lang: 'pt-BR',
        description: 'Apoio à identificação de risco e encaminhamento em acidentes ofídicos.',
        icons: [
          { src: '/images/rota-ofidica-logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/images/rota-ofidica-logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/images/rota-ofidica-logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }, null, 2)
    })
  }
}

export default defineConfig(() => ({
  plugins: [react(), vercelPwaManifest],
  base: process.env.VERCEL ? '/' : '/Rota-Ofidica-MVP/',
}))
