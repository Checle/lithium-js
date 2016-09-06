var test = require('tape')
var merge = require('../../build/util/merge.js').default
var mergeable = require('../../build/util/merge.js').mergeable

test('merge', (t) => {
  var Func, origin, trunk, branch, union

  Func = function Func () { }
  Func.prototype = {
    alpha: 50,
    beta: -10,
    delta: 20,
    read: function () { return this.alpha },
    write: function (value) { this.alpha = value }
  }
  // Decorate properties
  for (var key in Func.prototype) mergeable(Func.prototype, key, Object.getOwnPropertyDescriptor(Func.prototype, key))

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
