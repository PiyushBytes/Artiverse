import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = (
    process.env.VITE_API_URL ||
    env.VITE_API_URL ||
    process.env.API_PROXY_TARGET ||
    env.API_PROXY_TARGET ||
    process.env.VITE_API_PROXY_TARGET ||
    env.VITE_API_PROXY_TARGET ||
    process.env.BACKEND_URL ||
    env.BACKEND_URL ||
    ''
  ).trim().replace(/\/$/, '')

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
    ...(backend
      ? {
          define: {
            'import.meta.env.VITE_API_URL': JSON.stringify(backend),
          },
        }
      : {}),
    server: { host: '0.0.0.0', proxy: apiProxy },
    preview: { host: '0.0.0.0', proxy: apiProxy },
  }
})
