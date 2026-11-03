import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { pluginContatoLocal } from './server/dev-contact.js';

export default defineConfig(({ mode }) => ({
  plugins: [react(), pluginContatoLocal(loadEnv(mode, process.cwd(), ''))],
  server: {
    host: '127.0.0.1',
  },
}));
