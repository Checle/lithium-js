var test = require('tape');
var record = require('../src/record.js');

test('record', (t) => {

  record(() => undefined); // Function that accepts anything

  var block = record('block'); // Key
  t.equal(block.toString(), 'block');

  var content = {}, func = block(() => content);
  t.equal(func(), content);
  t.equal(record('block')(), content);

  var dir = record('/test/', () => this); // Function that remains in its scope
  dir('file1');
  dir('file2');
  dir('file3');
  for (var dirs = [], next = dir; next = next(); dirs.push(next.toString()));
  t.deepLooseEqual(dirs, ['file1', 'file2', 'file3']);

  var acceptor = () => 3; // Accepts anything and returns 3
  dir('file4', acceptor);
  t.equal(dir('file4', 'attr'), 3); // Any attribute of file4 should equal 3

  var file4 = dir('file4');
  // Next value of file4 should be the unaltered raw acceptor
  t.equal(file4(), acceptor);
  t.equal(file4()(), 3);

  t.end();
});
