import * as path from 'path';
import esbuild from 'esbuild';
import type { Plugin } from 'rollup';
import type { BuildOptions, BuildResult, PluginBuild } from 'esbuild';

export interface EsbuildResolveOptions {
  esbuild?: BuildOptions;
}

export const esbuildResolve = ({
  esbuild: esBuildOptions = {},
}: EsbuildResolveOptions = {}): Plugin => {
  let esbuildPluginBuild: PluginBuild | null = null;
  let esbuildResult: BuildResult | null = null;

  return {
    name: 'esbuild-resolve',
    async buildStart() {
      if (!esbuildResult) {
        [esbuildResult, esbuildPluginBuild] = await new Promise((resolve) => {
          let pluginBuildTmp: PluginBuild | undefined;
          esbuild
            .build({
              ...esBuildOptions,
              watch: true,
              plugins: [
                {
                  name: 'resolve-grab',
                  setup(pluginBuild) {
                    pluginBuild.onStart(() => {
                      pluginBuildTmp = pluginBuild;
                    });
                  },
                },
                ...(esBuildOptions.plugins || []),
              ],
            })
            .then((result) => {
              resolve([result, pluginBuildTmp!]);
            });
        });
      }
    },
    async buildEnd() {
      if (esbuildResult && esbuildResult.stop) {
        esbuildResult.stop();
        esbuildResult = null;
        esbuildPluginBuild = null;
      }
    },
    async resolveId(source, importer, options) {
      if (esbuildPluginBuild) {
        const { isEntry } = options;
        const resolveDir = isEntry || !importer ? path.dirname(source) : path.dirname(importer);
        const {
          path: id,
          sideEffects: moduleSideEffects,
          external,
          errors,
          warnings,
        } = await esbuildPluginBuild.resolve(source, { resolveDir, kind: 'entry-point' });

        if (errors && errors.length > 0) {
          /*
          errors.forEach(({ text }) => {
            this.error(text);
          });
          */
        }

        if (warnings && warnings.length > 0) {
          warnings.forEach(({ text }) => {
            this.warn(text);
          });
        }

        return id ? { id, external, moduleSideEffects } : null;
      }
      return null;
    },
  };
};
