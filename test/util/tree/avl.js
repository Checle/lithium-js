var test = require('tape')
var AVLTree = require('../../../build/util/tree/avl.js').default
var fork = require('../../../build/util/forks.js').default

test('AVLTree', (t) => {
  t.test('has', (t) => {
    var tree = new AVLTree()
    t.notOk(tree.has(8), 'should not contain a value initially')
    tree.add(8)
    t.ok(tree.has(8), 'should contain an added value')
    t.end()
  })

  t.test('find', (t) => {
    var tree = new AVLTree()
    t.deepLooseEqual(tree.find(8).value, null, 'should return null for a non-existing value')
    tree.add(5)
    t.equal(tree.find(8).value, 5, 'should return the next smallest value')
    tree.add(9)
    t.equal(tree.find(8).value, 5, 'should not change when a greater value is inserted')
    tree.add(2)
    t.equal(tree.find(2).value, 2, 'should return an equivalent value')
    t.end()
  })

  t.test('fork', (t) => {
    var tree1 = new AVLTree(), set1 = [91, 631, 12, 2, 129]
    for (var i of set1) tree1.add(i)

    var tree2 = fork(tree1), set2 = [591, 11, 1, 28]
    for (var i of set2) tree2.add(i)

    var has = true
    for (var i of set1) has &= tree1.has(i)
    t.ok(has, 'should contain all elements added before a fork')
    var nothas = true
    for (var i of set2) nothas &= !tree1.has(i)
    t.ok(nothas, 'should not contain any element added after a fork')
    t.end()
  })
})
