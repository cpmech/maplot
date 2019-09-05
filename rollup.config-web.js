import fs from 'fs';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const cacheRoot = '/tmp/rollup_typescript_cache';

const isJSFile = filename => /\.[jt]sx?$/.test(filename);

const examplesDir = path.resolve(__dirname, 'examples', 'js');

const exampleFiles = fs.readdirSync(examplesDir).filter(n => isJSFile(n));

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
  ...exampleFiles.map(f => ({
    input: `examples/js/${f}`,
    output: {
      name: f,
      file: `dist/examples/js/${f}`,
      format: 'iife',
    },
  })),
];
