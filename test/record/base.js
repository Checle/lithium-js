var test = require('tape');
var Record = require('../../src/record/base.js');

test('record', (t) => {

  t.test('installation and selection', (t) => {
    // TODO: test target = null here
    var record = new Record;

    var object = {}, installation = record('weather', 'today', object),
      selection = record('weather', 'today', object),
      reselection = record('weather', 'today', object);

    // TODO: even function interfaces should be equal: installation === selection
    t.equal(installation.valueOf(), selection.valueOf(), 'should point to equal records');
    t.equal(selection.valueOf(), reselection.valueOf(), 'should return the installed record on subsequent calls');
    t.equal(selection.valueOf(), object, 'should return the raw input object');
    t.end();
  });

  t.test('sequences', (t) => {
    var record = new Record;

    var dir = record('/dir/');
    dir('file0');
    dir('file1');
    dir('file2');
    dir('file3');

    for (var dirs = [], next = dir; (next = next()) && dirs.length < 10; dirs.push(next.valueOf()));
    t.deepLooseEqual(dirs, ['file0', 'file1', 'file2', 'file3'], 'should be iterable');
    t.end();
  });

  t.test

});
