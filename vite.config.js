import { optimizeDeps } from 'vite';

export default {
  root: './',
  build: {
    outDir: './dist',
  },
  optimizeDeps: {
    include: ['main.js'],
  },
};
