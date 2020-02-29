import { test, go, evaluate, cliAction, sleep } from 'testim';
import { delta, DiffClient } from '../../src';
import { expect } from 'chai';
declare function __non_webpack_require__(identifier: string): any;

test(async () => {
  await go('http://run.testim.io');
  await evaluate(() => document.body.innerHTML = '<h1>Hello World</h1>');
  const code = await cliAction(() => {
    const path = __non_webpack_require__('path');
    const client = __non_webpack_require__('fs').readFileSync(path.resolve('..', 'dist', 'main.bundle.js'));
    return client.toString();
  });
  await evaluate(() => document.body.innerHTML = '<h1>Go!</h1>');
  await evaluate((code) => {
    (0, eval)(code);
  }, code);
  const client = new DiffClient(async (ticket) => await evaluate((ticket) => (window as any).differ.delta(ticket), ticket));
  const initial = await client.sync();
  expect(initial).to.equal('<body><h1>Go!</h1></body>');
  await evaluate(() => document.body.innerHTML = '<h1>Diffs!</h1>');
  const next = await client.sync();
  expect(next).to.equal('<body><h1>Diffs!</h1></body>');
});