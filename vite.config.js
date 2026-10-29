import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'cloudflare-web-analytics',
      apply: (config, { command }) => command === 'build' && config.mode === 'production',
      transformIndexHtml: {
        order: 'post',
        handler: (html) => html.replace(
          '<!-- Cloudflare Web Analytics -->',
          `<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "e300160d171f4e5387345e68cd10c8a9"}'></script><!-- End Cloudflare Web Analytics -->`,
        ),
      },
    },
  ],
})
