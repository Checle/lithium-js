var fork = require('object-fork').fork
var test = require('tape')
var BufferList = require('../../build/util/list.js').default

function toBufferList (iterable) {
  var list = new BufferList()
  for (var value of iterable) list.push(Buffer.from(String(value)))
  return list
}

function toArray (list) {
  var array = []
  while (list.length) array.push(String(list.shift()))
  return array
}

test('BufferList', (t) => {
  var input = ['1', '2', '3', '4', '5']
  var list, copy

  list = toBufferList(input)
  t.equal(list.length, 5, 'push should update length')

  list = toBufferList(input)
  t.equal(list.toString(), '12345', 'toString should return a concatenation')

  list = toBufferList(input)
  copy = fork(list)
  t.equal(list.toString(), copy.toString(), 'should be forkable')

  list = toBufferList(input)
  copy = list.slice(2)
  t.equal(copy.toString(), '345', 'slice should trim leading elements')

  list = toBufferList(input)
  copy = list.slice(2, 4)
  t.equal(copy.toString(), '34', 'slice should crop trailing elements')

  list = toBufferList(input)
  copy = list.slice()
  copy.splice(2)
  list.push(6)
  t.equal(list.toString(), '123456', 'should not be affected by changes to its inheritors')
  t.equal(copy.toString(), '12', 'should not be affected by changes to its prototype')

  /*
  list = new BufferList()
  for (let item of input) list.push(Buffer.from(item))
    */


  t.end()
})
