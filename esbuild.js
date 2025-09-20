import process from 'process';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { format } from 'path/win32';

const isProduction = process.env['ENV'] == 'production';

/** @type {import('esbuild').Format} */
const formats = ['esm', 'iife', 'cjs'];

/**
 *
 * @param {import('esbuild').Format} format
 * @return {import('esbuild').BuildOptions}
 */
function getBuildOptions(format) {
  return {
    entryPoints: ['src/main.ts', 'src/main.scss'],
    outdir: `dist/${format}`,
    format,
    bundle: true,
    logLevel: 'info',
    minify: false,
    sourcemap: !isProduction,
    sourcesContent: !isProduction,
    plugins: [
      sassPlugin({
        filter: /\.(s[ac]ss|css)$/,
        type: 'css',
        style: isProduction ? 'compressed' : 'expanded',
        sourceMap: !isProduction,
        sourceMapIncludeSources: !isProduction,
      }),
    ],
  };
}

if (isProduction) {
  Promise.all(
    formats.map((format) => {
      return esbuild.build(getBuildOptions(format));
    }),
  );
} else {
  const ctx = await esbuild.context(getBuildOptions('iife'));
  await ctx.watch();
}
