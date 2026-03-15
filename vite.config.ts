import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/tweet': {
        target: 'https://cdn.syndication.twimg.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const id = url.searchParams.get('id');
          const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
          return `/tweet-result?id=${id}&lang=ja&token=${token}`;
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
