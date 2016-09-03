var test = require('tape')
var Stream = require('../../build/type/stream.js').default

test('Stream', (t) => {
  var stream = new Stream()

  stream.push('abc')
  stream.push('def')

  var head = stream.read(4)
  t.ok(Buffer.isBuffer(head))
  t.equal(String(head), 'abcd')
  t.equal(String(stream.read()), 'ef')
  t.equal(stream.read(), null)

  stream.seek(-stream.seek())
  t.equal(String(stream.read()), 'abcdef')
  t.equal(stream.read(), null)

  stream.seek(-5)
  t.equal(String(stream.read(1)), 'b')
  stream.seek(2)
  t.equal(String(stream.read(1)), 'e')

  stream.seek(-4)
  t.equal(stream.toString(), 'bcdef')
  t.equal(stream.toString(), 'bcdef')
  t.ok(Buffer.isBuffer(stream.valueOf()))

  t.end()
})
