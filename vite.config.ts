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
          return `/tweet-result?id=${id}&lang=ja&token=4`;
        },
      },
      '/api/bluesky': {
        target: 'https://public.api.bsky.app',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const handle = url.searchParams.get('handle');
          const rkey = url.searchParams.get('rkey');
          // First we need to resolve handle, but proxy can't do two-step.
          // For dev, we'll proxy directly to the thread endpoint.
          return `/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${rkey}&depth=0`;
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
