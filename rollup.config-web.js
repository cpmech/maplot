import fs from 'fs';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const cacheRoot = '/tmp/rollup_typescript_cache';

const isTSFile = (filename) => /\.[t]sx?$/.test(filename);

const examplesDir = path.resolve(__dirname, 'examples');
const exampleFiles = fs.readdirSync(examplesDir).filter((n) => isTSFile(n));

export default [
  // the ESM module including all dependencies
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index-all-in-one.js',
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

  // examples
  ...exampleFiles.map((f) => ({
    input: `examples/${f}`,
    output: {
      name: f,
      file: `dist/examples/${f.replace(/\.[^\.]+$/, '.js')}`,
      format: 'iife',
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
  })),

  /*
  {
    input: `examples/example5.ts`,
    output: {
      name: 'example5.ts',
      file: `dist/examples/example5.js`,
      format: 'iife',
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
  */
];
