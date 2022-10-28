# rollup-plugin-esbuild-resolve

<a href="https://www.npmjs.com/package/rollup-plugin-esbuild-resolve">
  <img src="https://img.shields.io/npm/v/rollup-plugin-esbuild-resolve.svg?style=flat-square" alt="Version">
</a>
<a href="https://www.npmjs.com/package/rollup-plugin-esbuild-resolve">
  <img src="https://img.shields.io/npm/dm/rollup-plugin-esbuild-resolve.svg?style=flat-square" alt="Downloads">
</a>
<br /><br />

Use [rollup](https://rollupjs.org/guide/en/) with the resolution algorithm implementation of [esbuild](https://github.com/evanw/esbuild).  
This plugin replaces [`@rollup/plugin-node-resolve`](https://github.com/rollup/plugins/tree/master/packages/node-resolve) and all rollup plugins which implement the TypeScript `compilerOptions.paths` resolution algorithm.

## Why

Esbuild has its own implementation of the [node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together) and it also implements the [compilerOptions.paths resolution algorithm](https://www.typescriptlang.org/tsconfig#paths) introduced by TypeScript.

The implementation has also one speciality - its not reading just one `tsconfig.json` file, its always reading the closest one from the importer file. This enables correct resolution of many interconnected projects, each one with their own `tsconfig.json`.

## Install

```
npm i rollup-plugin-esbuild-resolve -D
```

## Usage

```js
// rollup.config.js
import { esbuildResolve } from 'rollup-plugin-esbuild-resolve';

export default {
  plugins: [
    esbuildResolve({
      // optional:
      esbuild: {
        // pass custom esbuild options here
      }
    }),
  ],
}
```

## Options

`rollup-plugin-esbuild-resolve` has only one `optional` option:

### `esbuild`

Here you can pass custom [esbuilds build api options](https://esbuild.github.io/api/#build-api).

You can pass any options you like, but the options which are relevant for customizing the resolution algorithm are:

- [`platform`](https://esbuild.github.io/api/#platform): Customize the default values for various resolution related options.
- [`conditions`](https://esbuild.github.io/api/#conditions): Controls how the `exports` field in a `package.json` is interpreted.
- [`ignoreAnnotations`](https://esbuild.github.io/api/#ignore-annotations): Controls whether hints for side effects like the `sideEffects` field in a `package.json` or the inline `/* @__PURE__ */` comment are respected.
- [`mainFields`](https://esbuild.github.io/api/#main-fields): Controls which fields in a `package.json` are the entry point and in which order to check them.  
- [`nodePaths`](https://esbuild.github.io/api/#node-paths): Additional directories to check for modules.  
- [`preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks): Controls whether symlinks should be preserved.
- [`resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions): Controls which extensions in which order should be checked for a resolved file without extension.
- [`tsconfig`](https://esbuild.github.io/api/#tsconfig): Customize the name of the `tsconfig.json` file which should be checked.
- [`absWorkingDir`](https://esbuild.github.io/api/#working-directory): Customize the working directory.

## Corresponding `@rollup/plugin-node-resolve` options

| esbuild  | node-resolve |
| ------------- | ------------- |
| [`conditions`](https://esbuild.github.io/api/#conditions)  | [`exportConditions`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#exportconditions)  |
| [`mainFields`](https://esbuild.github.io/api/#main-fields) | [`mainFields`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#mainfields) |
| [`nodePaths`](https://esbuild.github.io/api/#node-paths) | [`moduleDirectories`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#moduledirectories) / [`modulePaths`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#modulepaths) |
| [`resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) | [`extensions`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#extensions) |
| [`absWorkingDir`](https://esbuild.github.io/api/#working-directory) | [`rootDir`](https://github.com/rollup/plugins/tree/master/packages/node-resolve/#rootdir) |

## License

MIT