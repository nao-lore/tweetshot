import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/tweet': {
        target: 'https://api.fxtwitter.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const id = url.searchParams.get('id');
          return `/status/${id}`;
        },
      },
      '/api/tiktok': {
        target: 'https://www.tiktok.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const tiktokUrl = url.searchParams.get('url');
          return `/oembed?url=${encodeURIComponent(tiktokUrl ?? '')}`;
        },
      },
      '/api/translate': {
        target: 'https://translate.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const text = url.searchParams.get('text');
          const to = url.searchParams.get('to');
          return `/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text ?? '')}`;
        },
      },
    },
  },
});
