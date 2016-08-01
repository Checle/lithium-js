var test = require('tape');
var Record = require('../src/record.js');

test('record', (t) => {

  var record = new Record; // Creates a branch without existing target

  record(() => undefined); // Function that accepts anything

  var block = record('block'); // Key
  t.equal(block.toString(), 'block');

  var content = {}, func = block(() => content);
  t.equal(func(), content);
  t.equal(record('block')(), content);

  // record('/test/', () => this); // this == record == Record.context
  // record('/test/')(() => this); // this == record('/test/') == Record.context

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

  var square = record('/test/square', (a) => a*a);
  t.equal(square(3).valueOf(), 9);
  t.equal(square()(), 9);

  // Create symbolic links
  record('/test/', (filename, content) {
    this(filename, () => this);
    this(filename)('.', this);
    this(filename, content);
  });
  var log = record('/test/log')((msg) => { this('./logfile', msg) });

  // FIXME
  // Add a new block: branches target
  var block = record('block', (id, handler) => this); // Blocks constitute a sequence of equal levels
  block(1); // Create an initial block
  block(2);
  record('advanced', 1); // Record top-level entity
  t.equal(record('advanced').valueOf(), 1);
  t.equal(block(2)('advanced').valueOf(), 1);
  t.deepLooseEqual(block(1)('advanced').valueOf(), null);

  var record = new Record;
  record('1');
  record('2');
  t.throws(() => record('0')); // Strings without acceptor should validate if greater than predecessor

  t.end();
});
