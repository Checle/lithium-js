var test = require('tape')
var PatriciaTrie = require('../../../build/util/tree/patricia.js').default

test('PatriciaTrie', (t) => {
  t.test('has', (t) => {
    var tree = new PatriciaTrie()
    t.notOk(tree.has('alpha-romeo'), 'should not contain a value initially')
    tree.add('alpha-romeo')
    t.ok(tree.has('alpha-romeo'), 'should contain an added value')
    t.end()
  })

  t.test('get', (t) => {
    var tree = new PatriciaTrie()
    var object = { toString: function () { return 'token' } }

    t.equal(tree.get('token'), undefined, 'should not contain a value initially')
    tree.add(object)
    t.equal(tree.get('token'), object, 'should return the value of a string representation')
    t.equal(tree.get('toke'), undefined, 'should not match prefixes')
    t.equal(tree.get(object), object, 'should accept object values')
    t.end()
  })

  /*
  t.test('match', (t) => {
    var tree = new PatriciaTrie()
    var object = { toString: function () { return 'token' } }

    t.equal(tree.match('token'), null, 'should not contain a value initially')
    tree.add(object)
    t.equal(tree.match('token'), object, 'should return the value for a perfect match')
    t.equal(tree.match('toke'), null, 'should return the value for a prefix match')
    t.equal(tree.match(object), object, 'should accept object values')
    t.end()
  })
  */

  t.test('find', (t) => {
    var tree = new PatriciaTrie()
    t.deepLooseEqual(tree.find('alphabet').value, null, 'should return null for a non-existing value')
    tree.add('alpha-romeo')
    t.equal(tree.find('alphabet').value, 'alpha-romeo', 'should return the next smallest value')
    tree.add('andes')
    t.equal(tree.find('alphabet').value, 'alpha-romeo', 'should not change when a greater value is inserted')
    tree.add('alps')
    t.equal(tree.find('alps').value, 'alps', 'should return an equivalent value')
    t.equal(tree.find('xylol').value, 'alps', 'should return the smallest possible value')
    t.end()
  })

  t.test('iterate', (t) => {
    var tree = new PatriciaTrie(), input = ['aabccd', 'abcccc', 'caaaa', 'bcabca', 'aaaaac']
    for (var str of input) tree.add(str)
    var output = []
    for (var node = tree.find('aaaaac'); node; node = node.next) output.push(node.value)
    input.sort()

    t.deepLooseEqual(output, input, 'nodes should be iterable in sorted order')

    var tree1 = new PatriciaTrie()
    var tree2 = new PatriciaTrie()
    tree1.next = tree2
    var input1 = ['aabccd', 'abcccc', 'caaaa']
    var input2 = ['bcabca', 'aaaaac']
    for (var str of input1) tree1.add(str)
    for (var str of input2) tree2.add(str)
    var output = []
    for (var node = tree1.first; node; node = node.next) output.push(node.value)
    input = input1.sort().concat(input2.sort())

    t.deepLooseEqual(output, input, 'trees should be concatenable')
    t.end()
  })

  t.test('slice', (t) => {
    var tree = new PatriciaTrie(), input = ['aaaaac', 'aabccd', 'abcccc', 'bcabca', 'caaaa']
    for (var str of input) tree.add(str)

    var slice = tree.slice(3)
    t.ok(slice.has('aac'), 'should contain a suffix')
    t.notOk(slice.has('aaaaac'), 'should not contain the full value')

    var select = tree.select('aa')
    t.ok(select.has('aaac'), 'should contain a suffix')
    t.notOk(select.has('aaaaac'), 'should not contain the full value')
    t.end()
  })
  t.end()
})
