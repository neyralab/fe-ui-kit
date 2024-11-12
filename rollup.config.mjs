import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: false,
        entryFileNames: '[name].esm.js',
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      postcss({
        extract: path.resolve('dist/styles.css'),
        minimize: true,
      }),
    ],
    external: (id) => /node_modules/.test(id),
  },
];
