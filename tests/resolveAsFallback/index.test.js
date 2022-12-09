const path = require('path');
const rollupPluginNodeResolve = require('@rollup/plugin-node-resolve');
const rollupBundle = require('../rollupBundle');

jest.mock('esbuild');

test('resolve node path', async () => {
  const cwd = path.resolve(__dirname, './bundle');
  const { imports, modules, code } = await rollupBundle(path.resolve(cwd, 'input.js'), {
    plugins: [
      rollupPluginNodeResolve({
        rootDir: cwd,
      }),
    ],
  });
  expect(imports).toEqual([]);
  expect(Object.keys(modules).length).toEqual(2);
  console.log(code);
});
