const path = require('path');
const rollupBundle = require('../rollupBundle');

test('resolve external', async () => {
  const cwd = path.resolve(__dirname, './bundle');
  const { imports, modules, code } = await rollupBundle(path.resolve(cwd, 'input.js'), {
    external: [/node_modules/],
  });
  expect(imports).toEqual(['some-module']);
  expect(Object.keys(modules).length).toEqual(1);
  console.log(code);
});
