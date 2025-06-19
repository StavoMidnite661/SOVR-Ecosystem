import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // historyApiFallback is not a valid option in Vite server config
  },
});
