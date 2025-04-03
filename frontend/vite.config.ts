import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '뚝딱뚝Doc',
        short_name: 'DDDD',
        description: '복잡한 문서, 한번에 뚝딱!',
        // start_url: "https://ddukdoc.shop/",
        // display_override: ["standalone"],
        display: "standalone",
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 기본 라이브러리
          react: ['react', 'react-dom'],
          // UI 라이브러리
          ui: ['lucide-react', 'react-router-dom', 'react-transition-group'],
          // 유틸리티
          utility: ['axios'],
          // 개발 도구
          devtools: ['@storybook/react', '@storybook/react-vite', 'msw'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
