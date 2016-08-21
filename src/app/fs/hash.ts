import Crypto from 'crypto'
import Type from '../../type.js'
import Stream from '../../stream.js'

export default function hash (buffer) {
  var stream = new Stream(buffer)
  var algorithm = 'sha256'
  var hash = Type.cs.read(stream)
  var data = Type.stream.toBuffer()

  if ((algorithm = /^(\w+):/.exec(hash))) {
    hash = hash.substr(algorithm[0].length)
    algorithm = algorithm[1]
  }

  var verifyHash = Crypto.createHash(algorithm).update(data).digest('hex')
  if (hash !== verifyHash) throw 'Invalid hash'
}
