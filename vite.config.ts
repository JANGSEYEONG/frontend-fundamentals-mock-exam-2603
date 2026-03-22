/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      _tosslib: path.resolve(__dirname, 'src/_tosslib'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      containers: path.resolve(__dirname, 'src/containers'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      models: path.resolve(__dirname, 'src/models'),
      pages: path.resolve(__dirname, 'src/pages'),
      remotes: path.resolve(__dirname, 'src/remotes'),
      sections: path.resolve(__dirname, 'src/sections'),
      services: path.resolve(__dirname, 'src/services'),
      shared: path.resolve(__dirname, 'src/shared'),
      stores: path.resolve(__dirname, 'src/stores'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    testTimeout: 10000,
  },
});
