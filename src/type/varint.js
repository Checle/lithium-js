export function read (stream) {
  return stream.shiftUInt32LE()
}
export function write (stream, number) {
  stream.pushUInt32LE(number)
}
