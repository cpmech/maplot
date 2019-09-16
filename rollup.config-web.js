import fs from 'fs';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const cacheRoot = '/tmp/rollup_typescript_cache';

const isJSFile = filename => /\.[j]sx?$/.test(filename);
const isTSFile = filename => /\.[t]sx?$/.test(filename);

const examplesDirJS = path.resolve(__dirname, 'examples', 'js');
const examplesDirTS = path.resolve(__dirname, 'examples', 'ts');

const exampleFilesJS = fs.readdirSync(examplesDirJS).filter(n => isJSFile(n));
const exampleFilesTS = fs.readdirSync(examplesDirTS).filter(n => isTSFile(n));

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

  // examples written in JS
  ...exampleFilesJS.map(f => ({
    input: `examples/js/${f}`,
    output: {
      name: f,
      file: `dist/examples/js/${f}`,
      format: 'iife',
    },
  })),

  // examples written in TS
  ...exampleFilesTS.map(f => ({
    input: `examples/ts/${f}`,
    output: {
      name: f,
      file: `dist/examples/ts/${f.replace(/\.[^\.]+$/, '.js')}`,
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
    input: `examples/ts/example5.ts`,
    output: {
      name: 'example5.ts',
      file: `dist/examples/ts/example5.js`,
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
