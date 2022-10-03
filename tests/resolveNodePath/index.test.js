const path = require('path');
const rollupBundle = require('../rollupBundle');

test('resolve node path', async () => {
  const cwd = path.resolve(__dirname, './bundle');
  const { imports, modules, code } = await rollupBundle(path.resolve(cwd, 'input.js'), {
    esbuild: {
      nodePaths: ['node_modules', 'node_modules_2'],
      absWorkingDir: cwd,
    },
  });
  expect(imports).toEqual([]);
  expect(Object.keys(modules).length).toEqual(3);
  console.log(code);
});
