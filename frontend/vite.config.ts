import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ssafy-api': {
        target: 'https://project.ssafy.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ssafy-api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 기본 라이브러리
          react: ['react', 'react-dom'],
          // UI 라이브러리
          ui: ['lucide-react', 'react-router-dom', 'react-transition-group'],
          // PDF 라이브러리
          pdf: ['@react-pdf/renderer'],
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
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
