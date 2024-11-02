import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
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
