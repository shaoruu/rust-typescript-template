import { Foo } from '../dist';

(async () => {
  const test = new Foo();
  await test.initialize();
  test.doSomething();
})();
