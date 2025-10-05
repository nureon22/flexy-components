import process from 'node:process';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const isProduction = process.env['ENV'] == 'production';
const destination = process.env["DEST"] || 'dist';

/** @type {import('esbuild').Format} */
const formats = ['esm', 'iife'];

/**
 *
 * @param {import('esbuild').Format} format
 * @return {import('esbuild').BuildOptions}
 */
function getBuildOptions(format) {
  return {
    entryPoints: ['src/main.ts', 'src/main.scss'],
    outdir: `${destination}/${format}`,
    format,
    bundle: true,
    logLevel: 'info',
    minify: isProduction,
    globalName: 'flexy',
    sourcemap: !isProduction,
    sourcesContent: !isProduction,
    target: 'es2020',
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
  const context = await esbuild.context(getBuildOptions('iife'));
  await context.watch();
}
