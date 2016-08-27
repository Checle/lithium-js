var test = require('tape')
var Tree = require('../../build/type/tree.js').default
var fork = require('../../build/fork.js').default

test('Tree', (t) => {
  t.test('contains', (t) => {
    var tree = new Tree
    t.notOk(tree.contains(8), 'should not contain a value initially')
    tree.add(8)
    t.ok(tree.contains(8), 'should contain an added value')
    t.end()
  })

  t.test('find', (t) => {
    var tree = new Tree
    t.deepLooseEqual(tree.find(8), null, 'should return null for a non-existing value')
    tree.add(5)
    t.equal(tree.find(8), 5, 'should return the next smallest value')
    tree.add(9)
    t.equal(tree.find(8), 5, 'should not change when a greater value is inserted')
    tree.add(2)
    t.equal(tree.find(2), 2, 'should return an equivalent value')
    t.end()
  })

  t.test('fork', (t) => {
    var tree1 = new Tree, set1 = [91, 631, 12, 2, 129]
    for (var i of set1) tree1.add(i)

    var tree2 = fork(tree1), set2 = [591, 11, 1, 28]
    for (var i of set2) tree2.add(i)

    var contains = true
    for (var i of set1) contains &= tree1.contains(i)
    t.ok(contains, 'should contain all elements added before a fork')
    var notContains = true
    for (var i of set2) notContains &= !tree1.contains(i)
    t.ok(notContains, 'should not contain any element added after a fork')
    t.end()
  })
})
