import { defineConfig } from 'vite';

export default defineConfig({
  // Base URL for subdomain deployment on thecodekid.com
  // When deploying to learn.thecodekid.com or play.thecodekid.com, set base to '/'
  // When deploying to thecodekid.com/app, set base to '/app/'
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
});
