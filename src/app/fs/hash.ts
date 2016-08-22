import * as crypto from 'crypto'
import * as type from '../../type.ts'
import Readable from '../../type/stream.ts'

export default function hash (buffer: Buffer) {
  var stream = new Readable(buffer)
  var algorithm = 'sha256'
  var hash = type.cs.read(stream)
  var data = stream.read()

  var match = /^(\w+):/.exec(hash)
  if (match) {
    hash = hash.substr(match[0].length)
    algorithm = match[1]
  }

  var verifyHash = crypto.createHash(algorithm).update(data).digest('hex')
  if (hash !== verifyHash) throw 'Invalid hash'
}
