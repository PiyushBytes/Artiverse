import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = (env.API_PROXY_TARGET || env.VITE_API_URL || '').trim().replace(/\/$/, '')
  const apiProxy = backend
    ? {
        '/av': {
          target: backend,
          changeOrigin: true,
        },
      }
    : undefined

  return {
    plugins: [react(), tailwindcss()],
    server: { host: '0.0.0.0', proxy: apiProxy },
    preview: { host: '0.0.0.0', proxy: apiProxy },
  }
})
