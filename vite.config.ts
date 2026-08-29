import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      // The service worker is registered manually in src/lib/pwa.ts.
      injectRegister: null,
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sogio',
        short_name: 'Sogio',
        description:
          'Sogio is a platform for managing your properties and stays.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        // A raiz agora é a landing page pública; o app instalado abre direto
        // no produto autenticado.
        start_url: '/app',
        scope: '/',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        // Navegações caem na casca limpa da SPA, nunca no HTML pré-renderizado
        // da landing — senão `/app` piscaria o conteúdo de marketing. A landing
        // e sua versão em inglês ficam de fora e são buscadas na rede.
        navigateFallback: '/app.html',
        navigateFallbackDenylist: [/^\/$/, /^\/en\/?$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
