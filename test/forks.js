var test = require('tape')
var fork = require('../build/forks.js').fork
var merge = require('../build/forks.js').merge
var isForkable = require('../build/forks.js').isForkable

test('forks', (t) => {
  t.test('fork', (t) => {
    var origin, object, copy, Func
    var Forkable = fork(function () { })

    Func = function Func () { }
    Func.prototype = {
      string: 'string',
      object: { object: true },
      array: [1, 2, 3, 4],
      method: () => { },
      forkable: new Forkable()
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

    fork(Array)
    copy = fork(new Func())

    t.notEqual(copy.array, object.array)
    t.deepLooseEqual(copy.array.slice(), object.array)

    Func = fork(Func)
    object = new Func()

    t.ok(object.forkable !== Func.prototype.forkable, 'should be usable as class decorator')

    t.end()
  })
  t.test('merge', (t) => {
    var Func, origin, trunk, branch, union

    Func = function Func () { }
    Func.prototype = {
      alpha: 50,
      beta: -10,
      delta: 20,
      read: function () { return this.alpha },
      write: function (value) { this.alpha = value }
    }
    Func = merge(Func)

    origin = new Func()
    trunk = merge(origin)

    t.equal(typeof trunk.read, 'function')
    t.equal(trunk.alpha, 50)

    branch = merge(origin)

    branch.write(200)
    trunk.write(100)
    branch.delta = 30

    t.equal(trunk.alpha, 100)
    t.equal(branch.alpha, 200)
    t.equal(origin.alpha, 50)

    union = merge(trunk, branch)
    
    t.equal(union.alpha, 200)
    t.equal(union.read(), 200)
    t.equal(union.delta, 30)

    t.end()
  })
  t.end()
})
