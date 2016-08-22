var test = require('tape')
var Record = require('../../build/record/base.js').default

test('record', (t) => {
  t.test('installation and selection', (t) => {
    // TODO: test target = null here
    var record = new Record

    var object = {}, installation = record('weather', 'today', object),
      selection = record('weather', 'today'),
      repetition = record('weather', 'today', object)

    // TODO: even function interfaces should be equal: installation === selection
    t.equal(installation, selection(), 'should point to equal records')
    t.equal(selection().valueOf(), repetition.valueOf(), 'should return the installed record on subsequent calls')
    t.equal(selection().valueOf(), object, 'should return the raw input object')
    t.end()
  })

  t.test('sequences', (t) => {
    // Input sequence
    var record = new Record, dir = record('/dir/')
    dir('file0')
    dir('file1')
    dir('file2')
    dir('file3')

    for (var dirs = [], next = dir; (next = next()) && dirs.length < 10; dirs.push(next.valueOf()));
    t.deepLooseEqual(dirs, ['file0', 'file1', 'file2', 'file3'], 'should be iterable')
    t.end()
  })

  t.test('successors', (t) => {
    // Input sequence
    var record = new Record, dir = record('/dir/')
    dir('file0')
    dir('file1')

    for (var dirs = [], next = dir; (next = next()) && dirs.length < 5; dirs.push(next.valueOf()));
    t.deepLooseEqual(dirs, ['file0', 'file1'], 'should be linked in forward order')

    var record = new Record, dir = record('/dir/', function (filename) {
        return this
      })
    dir('file0')
    dir('file1')

    t.end()
  })

  t.test('merge', (t) => {
    var record = new Record

    var child = record('child')
    child('a', 1)
    child('b', 2)
    child('c', 3)

    var target = record('target')
    child.call(target)

    t.equal(target('b')().valueOf(), 2, 'should be induced calling with different context as `this` argument')
    t.end()
  })

  t.test('execution', (t) => {
    var record = new Record

    var program = record('program', function () { return 189 })
    var branch = new program
    var result = branch('x')
    var combine = new program('x', 'y')

    t.equal(program('x')(), null, 'should not affect the calling record space')
    t.notEqual(branch(), null, 'should affect the resulting record space')
    t.equal(result.valueOf(), 189, 'should call the target function and be induced calling the `new` operator')
    t.equal(combine.valueOf(), 189, 'should apply inputs on the created branch')
    t.end()
  })
})
