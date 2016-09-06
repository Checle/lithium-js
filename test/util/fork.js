var test = require('tape')
var fork = require('../../build/util/fork.js').default
var forkable = require('../../build/util/fork.js').forkable
var isForkable = require('../../build/util/fork.js').isForkable

test('fork', (t) => {
  var origin, object, copy, Func
  var Forkable = forkable(function () { })

  Func = function Func () { }
  Func.prototype = {
    string: 'string',
    object: { object: true },
    array: [1, 2, 3, 4],
    method: () => { },
    forkable: new Forkable(),
    property: null
  }

  origin = new Func()
  object = fork(origin)

  t.ok(origin.isPrototypeOf(object))
  t.ok(isForkable(object))
  t.notOk(isForkable({}))

  copy = fork(object)

  t.notEqual(copy.forkable, object.forkable)
  t.ok(object.forkable.isPrototypeOf(copy.forkable))
  t.equal(copy.array, object.array)
  t.equal(copy.object, object.object)
  t.equal(copy.string, object.string)
  t.ok(copy.method === origin.method && copy.method === origin.method)

  forkable(Array)
  copy = fork(new Func())

  t.notEqual(copy.array, object.array)
  t.deepLooseEqual(copy.array.slice(), object.array)

  Func = forkable(Func) // Class decorator
  object = new Func()

  t.ok(object instanceof Func, 'should instantiate a constructor when called with new')
  t.ok(object.forkable !== Func.prototype.forkable, 'should be usable as class decorator')

  forkable(Func.prototype, 'property') // Property decorator
  origin = new Func()
  origin.property = { x: 1 }
  copy = fork(origin)
  t.notEqual(origin, copy, 'as property decorator, should cause a fork of the property')
  t.equal(origin.x, copy.x, 'as property decorator, should preserve deep properties')

  t.end()
})
