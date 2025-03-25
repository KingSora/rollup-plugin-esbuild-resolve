# Changelog

## 1.3.1

Fix node process not ending in some situations. [#2](https://github.com/KingSora/rollup-plugin-esbuild-resolve/pull/2)

## 1.3.0

Make the plugin work with `esbuild ^0.17.0` and `rollup ^4.0.0`.

## 1.2.0

Set the order to `post` so this plugin can be used together with `@rollup/plugin-node-resolve` and other resolve plugins.

## 1.1.1

Set the `rollup` peer dependency to `^2.79.1 || ^3.0.0` to support rollup `v3`.

## 1.1.0

Respects rollups `external` option.

## 1.0.0

Initial version of `rollup-plugin-esbuild-resolve`.