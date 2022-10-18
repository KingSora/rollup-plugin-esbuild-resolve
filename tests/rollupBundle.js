const { rollup } = require('rollup');
const { esbuildResolve } = require('../dist/index');

module.exports = async (input, rollupOptions = {}, esbuildResolveOptions = {}) => {
  const config = {
    input,
    output: {
      file: 'output.js',
    },
    ...rollupOptions,
    plugins: [esbuildResolve(esbuildResolveOptions)],
  };
  const bundle = await rollup(config);
  const generated = await bundle.generate(config.output);
  return generated.output[0];
};
