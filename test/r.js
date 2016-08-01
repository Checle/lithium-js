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
  dir('file0');
  dir('file1', () => true); // Branch updates owner.target but not owner.next
  dir('file2')(() => true);
  dir('file3');
  for (var dirs = [], next = dir; next = next(); dirs.push(next.toString()));
  t.deepLooseEqual(dirs, ['file0', 'file1', 'file2', 'file3']);

  var acceptor = () => 3; // Accepts anything and returns 3
  dir('file4', acceptor);
  t.equal(dir('file4', 'attr'), 3); // Any attribute of file4 should equal 3

  var file4 = dir('file4');
  // Next value of file4 should be the unaltered raw acceptor
  t.equal(file4(), acceptor);
  t.equal(file4()(), 3);

  var dir = record('/test/');
  record('/test/file0/', '..', dir); // Directory link
  t.equal(record('/test/file2/..')()(), true);

  // FIXME
  // Add a new block: branches target
  block(() => this); // Blocks constitute a sequence of equal levels
  block(1); // Create an initial block
  block(2);
  record('advanced', 1); // Record top-level entity
  t.equal(record('advanced').valueOf(), 1);
  t.equal(block(2)('advanced').valueOf(), 1);
  t.deepLooseEqual(block(1)('advanced').valueOf(), null);

  t.end();
});
