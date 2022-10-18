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
        const esbuildResolvedResult = id ? { id, external, moduleSideEffects } : null;
        if (esbuildResolvedResult) {
          const rollupResolvedResult = await this.resolve(id, importer, {
            ...options,
            skipSelf: true,
          });

          if (rollupResolvedResult) {
            // Handle plugins that manually make the result external and the external option
            if (rollupResolvedResult.external) {
              return false;
            }
            // Allow other plugins to take over resolution
            if (rollupResolvedResult.id !== id) {
              return rollupResolvedResult;
            }
            return { ...esbuildResolvedResult, meta: rollupResolvedResult.meta };
          }
        }

        return esbuildResolvedResult;
      }
      return null;
    },
  };
};
