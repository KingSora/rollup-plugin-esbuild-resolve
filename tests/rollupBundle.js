const { rollup } = require('rollup');
const { esbuildResolve } = require('../dist/index');

module.exports = async (input, options) => {
  const config = {
    input,
    output: {
      file: 'output.js',
    },
    plugins: [esbuildResolve(options)],
  };
  const bundle = await rollup(config);
  const generated = await bundle.generate(config.output);
  return generated.output[0];
};
