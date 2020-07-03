import typescript from 'rollup-plugin-typescript2';

const cacheRoot = '/tmp/rollup_typescript_cache';

const external = [];

const config = ['cjs', 'esm'].map((format) => {
  return {
    input: {
      index: 'src/index.ts',
    },
    output: [
      {
        dir: `dist/${format}`,
        format,
      },
    ],
    external,
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: format === 'esm' } },
      }),
    ],
  };
});

export default config;
