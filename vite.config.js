
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backend = (
    env.VITE_API_URL ||
    env.VITE_API_PROXY_TARGET ||
    env.BACKEND_URL ||
    'https://api.arteza.online'
  ).trim().replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    server: {
      host: '0.0.0.0',

      proxy: {
        '/av': {
          target: backend,
          changeOrigin: true,
          secure: true,
        },
      },
    },

    preview: {
      host: '0.0.0.0',

      proxy: {
        '/av': {
          target: backend,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
