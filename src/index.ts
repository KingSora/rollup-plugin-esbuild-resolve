import * as path from 'path';
import esbuild from 'esbuild';
import type { Plugin } from 'rollup';
import type { BuildContext, BuildOptions, PluginBuild } from 'esbuild';

export interface EsbuildResolveOptions {
  esbuild?: BuildOptions;
}

export const esbuildResolve = ({
  esbuild: esBuildOptions = {},
}: EsbuildResolveOptions = {}): Plugin => {
  let esbuildPluginBuild: PluginBuild | null = null;
  let esbuildContext: BuildContext | null = null;

  const createEsbuild = async () => {
    if (!esbuildContext) {
      let contextPromise: Promise<BuildContext> | undefined;
      const pluginBuildPromise = new Promise<PluginBuild>((resolvePluginBuild) => {
        contextPromise = new Promise<BuildContext>((resolveContext) => {
          esbuild
            .context({
              ...esBuildOptions,
              plugins: [
                {
                  name: 'resolve-grab',
                  setup(pluginBuild) {
                    pluginBuild.onStart(() => {
                      resolvePluginBuild(pluginBuild);
                    });
                  },
                },
                ...(esBuildOptions.plugins || []),
              ],
            })
            .then((context) => {
              context.watch().then(() => {
                resolveContext(context);
              });
            });
        });
      });

      if (!contextPromise) {
        throw new Error('ContextPromise not found.');
      }

      [esbuildPluginBuild, esbuildContext] = await Promise.all([
        pluginBuildPromise,
        contextPromise,
      ]);
    }
  };

  const destroyEsbuild = () => {
    if (esbuildContext) {
      esbuildContext.dispose();
      esbuild.stop();
      esbuildContext = null;
      esbuildPluginBuild = null;
    }
  };

  return {
    name: 'esbuild-resolve',
    async buildEnd() {
      destroyEsbuild();
    },
    resolveId: {
      order: 'post',
      async handler(source, importer, options) {
        await createEsbuild();

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
    },
  };
};
