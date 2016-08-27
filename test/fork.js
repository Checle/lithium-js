var test = require('tape')
var fork = require('../build/fork.js').default
var isForkable = require('../build/fork.js').isForkable

test('fork', (t) => {
  var Forkable = fork(function () { })

  function Func () { }
  Func.prototype = {
    string: 'string',
    object: { object: true },
    array: [1, 2, 3, 4],
    method: () => { },
    forkable: new Forkable()
  }

  var origin = new Func()
  var object = fork(origin)

  t.ok(origin.isPrototypeOf(object))
  t.ok(isForkable(object))
  t.notOk(isForkable({}))

  var copy = fork(object)

  t.notEqual(copy.forkable, object.forkable)
  t.ok(object.forkable.isPrototypeOf(copy.forkable))
  t.equal(copy.array, object.array)
  t.equal(copy.object, object.object)
  t.equal(copy.string, object.string)
  t.ok(copy.method === origin.method && copy.method === origin.method)

  fork(Array)
  copy = fork(new Func())

  t.notEqual(copy.array, object.array)
  t.deepLooseEqual(copy.array.slice(), object.array)

  t.end()
})
