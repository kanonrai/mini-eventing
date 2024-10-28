import swc from 'unplugin-swc';

/** @type {import('rollup').RollupOptions} */
const options = {
  plugins: [
    swc.rollup({
      tsconfigFile: false,
    }),
  ],
  input: 'src/index.ts',
  output: {
    file: 'lib/event-emitter.js',
  },
};

export default options;
