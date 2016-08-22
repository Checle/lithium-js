var test = require('tape');
var Record = require('../src/record/base.js');

test('record', (t) => {

  t.test('merge', (t) => {
    var record = new Record;

    var child = record('child');
    child('a', 1);
    child('b', 2);
    child('c', 3);

    var target = record('target');
    child.call(target);

    t.equal(target('b')().valueOf(), 2, 'should be inducible specifying a target context as `this` argument');
    t.end();
  });

  t.test('execution', (t) => {
    var record = new Record;

    var program = record('program', function () { return 189; });
    var result = new program('x');

    t.equal(program('x'), null, 'should not affect the calling record space');
    t.notEqual(result(), null, 'should affect the resulting record space');
    t.equal(result().valueOf(), 189, 'should call the target function and be inducible calling the `new` operator');
    t.end();
  });

  t.test('subscribers', (t) => {
    var record = new Record;

    var received = [];
    function subscriber(value) { received.push(value); }

    var feed = record('data-feed', () => null); // Some program and some acceptor

    // Subscribe
    feed(subscriber);

    feed(1);
    feed(2);
    feed(3);

    t.deepLooseEqual(received, [1, 2, 3], 'should receive state values');
    t.end();
  });

  t.test('call arguments', (t) => {
    var value = 24713308211L,
      key = record('http://google.com', value),
      existingKey = record('http://google.com', value),
      value = record('http://google.com')(value),
      existingValue = record('http://google.com')();

    t.equal(key.toString(), 'http://google.com', 'should return the uppermost identifier');
    t.notEqual(key.valueOf(), value, 'should not return newly created value atoms nor the last argument');
    t.equal(value.valueOf(), value, 'should give access to a value when called in a separate context');
    t.equal(existingValue.valueOf(), value, 'should behave equally when existing values are selected');
    t.equal(existingValue.valueOf(), 'http://google.com', 'should behave equally with multiple existing arguments');
    t.end();
  });

  t.test('order relation and target overriding', (t) => {
    var acceptor,
      change = record('http://', 'change.org'),
      abc = record('http://', 'abc.xyz');

    // Default acceptor compares valueOf() by < operator
    change('/');
    t.throws(() => record('http://', 'change.org', '\n'), Error, 'should not accept values that compare lesser');
    t.doesNotThrow(() => record('http://', 'change.org', '?'), null, 'should accept values that do not compare lesser');
    t.doesNotThrow(() => acceptor = record('http://', 'change.org', () => ':'), null, 'should accept functions over strings')
    t.equal(record('http://change.org').valueOf(), ':', 'should install functions as acceptor');

    abc('/');
    t.doesNotThrow(() => acceptor = record('http://', 'abc.xyz', {}), null, 'should accept objects over strings')
    t.doesNotThrow(() => acceptor = record('http://', 'abc.xyz', () => ':'), null, 'should accept functions over objects')
    t.doesNotThrow(() => acceptor = record('http://', 'abc.xyz', {}), null, 'should not accept objects over functions')
    t.end();
  });

  t.test('argument hierarchy', (t) => {
    var search1 = record('http://', 'www.google.com', () => this, '/search');
    var search2 = record('http://', 'www.google.com', '/search');
    var search3 = record('http://www.google.com/search');
    var search4 = record('http', '://www.google.com/search');

    t.equal(search1, search2, 'subsequent arguments should be applied on previous arguments');
    t.equal(search2, search3, 'should match prefixes');
    t.notEqual(search3, search4, 'should not match non-existing partitions');
    t.end();
  });

  t.test('path and value', (t) => {
    var bin = record('/usr', '/bin');
    var etc = record('/usr', '/etc');

    t.equal(bin.toString(), '/usr/bin', 'should return the full path');
    t.equal(etc.toString(), '/usr', 'should return the portion that uniquely identifies the record');
    t.equal(record(bin.toString()), bin);
    t.equal(record(etc.toString()), etc);
    t.end();
  });

  t.test('path', (t) => {
    var record = new Record;

    var base = record('base', 'version', 1);
    t.equal(base.toString(), '', 'should be the empty string for the current target');
    record('successor', 'version', 1);
    t.equal(base.toString(), 'base', 'should reflect the current state of the system');
    record('base', 'version', 2);
    t.equal(base.toString(), 'baseversion2', 'should return the full path once its target is overridden');
    t.end();
  });

  t.test('default constraints', (t) => {
    var record = new Record;

    t.doesNotThrow(() => record('chx', 'version', 1), RangeError, 'should accept a lesser key within the same calling context');
    t.throws(() => record('chx', 'version', 0), RangeError, 'should not accept a lesser key than an existing one from a previous context');
    t.doesNotThrow(() => record('chx', 'version', 2), RangeError, 'should accept a greater key');
    t.throws(() => record('paypal.com', 'version')(0), RangeError, 'should not accept a lesser key on an existing context by default');
    t.end();
  });

  t.test('branch', (t) => {
    var record = new Record;

    record((name) => undefined); // Function that accepts anything
    var block = record('block', true);
    t.notEqual(Record('block').valueOf(), block.valueOf(), 'should not affect the underlying tree');

    t.test('block', (t) => {
      record('block', 1, 2);
      t.equal(block.toString(), 'block', 'should equal the block root');
    });
    t.end();
  });

  t.test('symbolic links', (t) => {
    var record = new Record;

    // Create dir
    var dir = record('/', 'dir/');
    // Create file content
    record('/', 'dir/', 'file', 'content');
    // Create symbolic link
    record('/', 'dir/', '../', dir);

    var content = dir('../', 'file')();
    t.equal(content && content.valueOf(), 'content', 'should expose records of the target');
  });

  t.end();

});
