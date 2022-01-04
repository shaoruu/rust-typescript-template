import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import wasm from '@rollup/plugin-wasm';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';
import path from 'path';

const packageJson = require('./package.json');

const globals = {
  ...packageJson.devDependencies,
};

export default {
  input: 'src/index.ts',
  output: {
    file: packageJson.module,
    format: 'esm', // ES Modules
    sourcemap: true,
  },
  plugins: [
    wasm({
      sync: [path.resolve(__dirname, 'pkg', 'index_bg.wasm')],
      maxFileSize: Infinity,
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    {
      writeBundle() {
        fs.copyFile(
          path.resolve(__dirname, 'pkg', 'index_bg.wasm'),
          path.resolve(__dirname, 'dist', 'index_bg.wasm'),
          (err) => {
            if (err) throw err;
          },
        );
      },
    },
    ...(!process.env.ROLLUP_WATCH ? [terser()] : []),
  ],
  external: Object.keys(globals),
  watch: { clearScreen: false },
};
