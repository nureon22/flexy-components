import process from 'process';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const isProduction = process.env['ENV'] == 'production';

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['src/main.ts', 'src/main.scss'],
  outdir: 'docs/assets',
  bundle: true,
  logLevel: 'info',
  minify: isProduction,
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

if (isProduction) {
  await esbuild.build(options);
} else {
  const ctx = await esbuild.context(options);
  await ctx.watch();
}
