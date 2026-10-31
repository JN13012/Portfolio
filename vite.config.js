import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Workers Builds names the branch: the AI Lab reaches the preview's build, never production's.
  define: {
    'import.meta.env.VITE_AI_LAB_PREVIEW': JSON.stringify(process.env.WORKERS_CI_BRANCH === 'developpement'),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The AI Lab's API runs in `wrangler dev`.
    proxy: { '/api/lab': { target: 'http://127.0.0.1:8787', changeOrigin: true } },
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
