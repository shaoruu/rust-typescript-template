import init, { add } from "../pkg";

export class Foo {
  ready = false;

  public async initialize(): Promise<void> {
    await init();
    this.ready = true;
  }

  public add(a: number, b: number) {
    return add(a, b);
  }
}
