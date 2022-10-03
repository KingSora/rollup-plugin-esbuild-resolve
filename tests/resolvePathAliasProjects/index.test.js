const path = require('path');
const rollupBundle = require('../rollupBundle');

test('resolve path alias', async () => {
  const { imports, modules, code } = await rollupBundle(
    path.resolve(__dirname, './bundle/input.js')
  );
  expect(imports).toEqual([]);
  expect(Object.keys(modules).length).toEqual(3);
  console.log(code);
});
