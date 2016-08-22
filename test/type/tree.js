var test = require('tape')
var Tree = require('../../build/type/tree.js').default

test('Tree.contains', (t) => {
  var tree = new Tree
  t.notOk(tree.contains(8))
  tree.add(8)
  t.ok(tree.contains(8))
  t.end()
})

test('Tree.find', (t) => {
  var tree = new Tree
  t.deepLooseEqual(tree.find(8), null)
  tree.add(5)
  t.equal(tree.find(8), 5)
  tree.add(9)
  t.equal(tree.find(8), 5)
  tree.add(2)
  t.equal(tree.find(2), 2)
  t.end()
})

test('Tree.extend', (t) => {
  var tree1 = new Tree, set1 = [91, 631, 12, 2, 129]
  for (var i of set1) tree1.add(i)

  var tree2 = Object.create(tree1), set2 = [591, 11, 1, 28]
  for (var i of set2) tree2.add(i)

  for (var i of set1) t.ok(tree1.contains(i))
  for (var i of set2) t.notOk(tree1.contains(i))
  t.end()
})
