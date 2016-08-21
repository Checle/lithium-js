import Crypto from 'crypto'
import Type from '../../type.ts'
import Readable from '../../type/stream.ts'

export default function hash (buffer) {
  var stream = new Readable(buffer)
  var algorithm = 'sha256'
  var hash = Type.cs.read(stream)
  var data = Type.stream.toBuffer()

  var match = /^(\w+):/.exec(hash)
  if (match) {
    hash = hash.substr(match[0].length)
    algorithm = match[1]
  }

  var verifyHash = Crypto.createHash(algorithm).update(data).digest('hex')
  if (hash !== verifyHash) throw 'Invalid hash'
}
