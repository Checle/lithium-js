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

    t.equal(target('b')().valueOf(), 2, 'should be induced specifying a target context as `this` argument');
    t.end();
  });

  t.test('execution', (t) => {
    var record = new Record;

    var program = record('program', function () { return 189; });
    var result = new program('x');

    t.equal(program('x'), null, 'should not affect the calling record space');
    t.notEqual(result(), null, 'should affect the resulting record space');
    t.equal(result().valueOf(), 189, 'should call the target function and be induced calling the `new` operator');
    t.end();
  });

});
