import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    lib: {
      entry: 'src/index.ts',
      name: 'MiniEventing',
      fileName: 'mini-eventing',
    },
    sourcemap: true,
    outDir: 'lib',
    minify: true,
  },
});
