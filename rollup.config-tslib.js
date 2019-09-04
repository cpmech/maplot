import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const cacheRoot = '/tmp/rollup_typescript_cache';

const external = [
  'fs',
  'path',
  'js-yaml',
  'child_process',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external,
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
    ],
  },
  {
    input: {
      index: 'src/index.ts',
      canvas: 'src/canvas/index.ts',
      components: 'src/components/index.ts',
      debug: 'src/debug/index.ts',
      dom: 'src/dom/index.ts',
      geometry: 'src/geometry/index.ts',
      helpers: 'src/helpers/index.ts',
      io: 'src/io/index.ts',
      marker: 'src/marker/index.ts',
    },
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    external,
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: true } },
      }),
    ],
  },
];
