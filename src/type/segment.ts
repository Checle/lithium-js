import * as vn from './vn.ts'

export function read (stream) {
  var length = vn.read(stream)
  return stream.shift(length)
}
export function write (stream, buffer) {
  vn.write(stream, buffer.length)
  stream.push(buffer)
}
