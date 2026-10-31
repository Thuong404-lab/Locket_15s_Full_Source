const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'Locket_Notification_Test.js'), 'utf8');

function run(overrides = {}) {
  const outputs = [];
  const logs = [];
  const sandbox = { console: { log: message => logs.push(message) }, ...overrides, $done: output => outputs.push(output) };
  // No traffic or HTTP client globals: the test must run without any app request.
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  assert.equal(outputs.length, 1);
  return logs;
}

test('independent notification test caps attempts across fresh scheduled invocations', () => {
  const state = new Map();
  const notifications = [];
  const apis = {
    $persistentStore: { read: key => state.get(key), write(value, key) { state.set(key, value); return true; } },
    $notification: { post: (...args) => notifications.push(args) },
  };
  for (let i = 0; i < 10; i++) run(apis);
  assert.equal(notifications.length, 3);
  assert.equal(state.size, 1);
  assert.equal([...state.values()][0], '3');
});

test('missing APIs and failed storage do not bypass the attempt limit or block completion', () => {
  run();
  run({ $notification: { post() { assert.fail('Missing storage must skip'); } } });
  run({ $notification: { post() { assert.fail('Failed storage must skip'); } }, $persistentStore: { read() { throw Error('read failed'); }, write() { return true; } } });
  run({ $notification: { post() { assert.fail('Failed storage must skip'); } }, $persistentStore: { read() { return null; }, write() { return false; } } });
});

test('failed notification API consumes a bounded attempt and does not reveal exception text', () => {
  let saved;
  let calls = 0;
  const apis = {
    $notification: { post() { calls++; throw Error('mock-sensitive-exception'); } },
    $persistentStore: { read: () => saved, write(value) { saved = value; return true; } },
  };
  for (let i = 0; i < 6; i++) assert.ok(run(apis).every(line => !line.includes('mock-sensitive-exception')));
  assert.equal(calls, 3);
});

test('standalone module schedules only the self-test and declares no interception or MITM', () => {
  const moduleText = fs.readFileSync(path.join(root, 'Locket_Notification_Test.sgmodule'), 'utf8');
  const rules = moduleText.split(/\r?\n/).filter(line => line.includes('script-path='));
  assert.equal(rules.length, 1);
  assert.match(rules[0], /type=cron, cronexp="\* \* \* \* \*"/);
  assert.ok(!/^\[(MITM|Rule|General)\]/m.test(moduleText));
  assert.ok(!rules[0].includes('wake-system'));
  const scriptUrl = new URL(rules[0].match(/script-path=([^,\s]+)/)[1]);
  assert.equal(scriptUrl.origin, 'https://raw.githubusercontent.com');
  assert.equal(path.basename(scriptUrl.pathname), 'Locket_Notification_Test.js');
});
