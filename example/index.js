import { Foo } from "../dist";

(async () => {
  const test = new Foo();
  await test.initialize();

  const result = test.add(1, 3);
  document.getElementById(
    "content"
  ).textContent = `1 + 3 in WASM = ${result} !`;
})();
