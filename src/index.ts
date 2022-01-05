import * as wasm from "../pkg/index_bg.wasm";

import { init } from "./wasm";

export class Foo {
  wasm!: typeof wasm;

  public async initialize(): Promise<void> {
    this.wasm = (await init()) as any;
  }

  public add(a: number, b: number) {
    return this.wasm.add(a, b);
  }
}
