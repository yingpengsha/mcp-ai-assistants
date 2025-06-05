import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../assets',
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  assetsInclude: ['**/*.svg'],
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
  ],
  server: {
    open: true,
    port: 8008,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#174ae6',
        },
        javascriptEnabled: true,
      },
    },
    modules: {},
  },
})
