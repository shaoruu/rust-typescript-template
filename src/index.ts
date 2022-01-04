import init, { add } from "../pkg";

export class Foo {
  ready = false;

  public async initialize(): Promise<void> {
    await init();
    this.ready = true;
  }

  public doSomething() {
    console.log("1 + 2 in WASM is:", add(1, 2));
  }
}
