import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Ensure Vite pre-bundles react-is and doesn't externalize packages needed for SSR
      optimizeDeps: {
        include: ['react-is']
      },
      ssr: {
        noExternal: ['recharts', 'react-is']
      },
      build: {
        rollupOptions: {
          // If you want Rollup to treat react-is as external, list it here. We keep it
          // listed to match older guidance, but having react-is installed is the real fix.
          external: ['react-is']
        }
      }
    };
});
