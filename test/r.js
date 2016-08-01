var test = require('tape');
var record = require('../src/record.js');

test('record', (t) => {

  record(() => undefined); // Function that accepts anything

  var block = record('block'); // Key

  t.equal(block.toString(), 'block');

  var content = {}, func = block(() => content);

  t.equal(func(), content);
  t.equal(record('block')(), content);

  var dir = record('/test/', () => this);
  dir('file1');
  dir('file2');
  dir('file3');
  for (var dirs = [], next = dir; next = next(); dirs.push(next.toString()));
  t.deepLooseEqual(dirs, ['file1', 'file2', 'file3']);

  t.end();
});
