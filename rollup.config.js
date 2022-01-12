import fs from "fs";
import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import { base64 } from "rollup-plugin-base64";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const packageJson = require("./package.json");

const globals = {
  ...packageJson.devDependencies,
};

export default {
  input: "src/index.ts",
  output: {
    file: packageJson.module,
    format: "esm",
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    nodePolyfills(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    // used to load in .wasm files as base64 strings, then can be instantiated with
    // helper functions within `src/wasm.ts`.
    base64({ include: "**/*.wasm" }),
    {
      // copy over rust-built declaration files to dist for later .d.ts bundling
      name: "copy-pkg",
      generateBundle() {
        fs.mkdirSync(path.resolve(`dist/pkg`), { recursive: true });

        ["index.d.ts", "index_bg.wasm.d.ts"].forEach((file) => {
          fs.copyFileSync(
            path.resolve(`./pkg/${file}`),
            path.resolve(`./dist/pkg/${file}`)
          );
        });

        fs.copyFileSync(
          path.resolve(`./pkg/index_bg.wasm`),
          path.resolve(`./dist/index_bg.wasm`)
        );
      },
    },
    ...(!process.env.ROLLUP_WATCH ? [terser()] : []),
  ],
  external: [...Object.keys(globals)],
  watch: { clearScreen: false },
};
