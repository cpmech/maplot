import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const cacheRoot = '/tmp/rollup_typescript_cache';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index-esm.js',
      format: 'esm',
    },
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve({
        mainFields: ['module'],
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  },
  {
    input: 'examples/example1.js',
    output: {
      file: 'dist/example1.js',
      format: 'iife',
    },
  },
];
