var test = require('tape')

test('Array', (t) => {
  t.test('Object.create', (t) => {
    var parent = [1, 2, 3]
    var child = Object.create(parent)

    child.push(4)
    t.deepLooseEqual(child.slice(), [1, 2, 3, 4], 'should inherit equal behavior')
    t.deepLooseEqual(parent, [1, 2, 3], 'should not affect the parent array')

    parent.push(5)
    t.deepLooseEqual(child.slice(), [1, 2, 3, 4], 'should cover parent array properties')

    parent.push(6)
    t.deepLooseEqual(child.slice(), [1, 2, 3, 4], 'does not alter the child array')
    t.end()
  })
  t.end()
})
