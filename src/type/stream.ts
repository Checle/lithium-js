import * as stream from 'stream'

export default class Stream extends stream.PassThrough {
  // Standard IO stream enhanced by string and seeking capabilities.

  static isReadable (stream) {
    // Condition in concordance with stream source
    return (stream instanceof stream.Readable) || (stream instanceof stream.Duplex)
  }
  static isWriteable (stream) {
    // Condition in concordance with stream source
    return (stream instanceof stream.Writeable) || (stream instanceof stream.Duplex)
  }
  static isDuplex (stream) {
    return Stream.isReadable(stream) && Stream.isWriteable(stream)
  }

  private head
  private chunkLengths
  private position

  length

  constructor (source) {
    super()

    this.head = []
    this.chunkLengths = []
    this.position = 0

    if (source != null) {
      if (source && Stream.isReadable(source)) {
        source.pipe(this)
      } else {
        this.push(source)
      }
    }
  }

  valueOf () {
    var buffer = super.read() // Read causes readable to copy chunks into single buffer
    if (buffer != null) this.unshift(buffer) // Add back single buffer as a single chunk
    return buffer
  }

  toString () {
    return String(this.valueOf())
  }

  push (chunk, encoding?) {
    if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string') chunk = String(chunk)

    var length = chunk.length
    var result = super.push(chunk, encoding)
    if (!result) return false

    this.length += length
    this.chunkLengths.push(length)
    return true
  }

  unshift (chunk) {
    if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string') chunk = String(chunk)

    var length = chunk.length
    var result = super.unshift(chunk)
    if (result) return false

    this.length += result
    this.chunkLengths.unshift(length)
    return true
  }

  read (size?) {
    var result = super.read(size)
    if (result == null) return null
    var length = result.length

    this.head.push(result)
    this.position += length
    this.length -= length
    while (length > 0 && this.chunkLengths.length) {
      length -= this.chunkLengths.shift()
    }
    // Add remaining chunk length
    if (length < 0) {
      this.chunkLengths.unshift(-length)
    }
    return result
  }

  seek (offset) {
    var chunk, length

    if (offset < 0) {
      while (offset < 0 && this.head.length) {
        chunk = this.head.pop()
        length = chunk.length
        offset += length
        this.unshift(chunk)
        this.chunkLengths.push(length)
      }
      // Add remainder back to head
      if (offset > 0) {
        this.read(offset)
      }
    } else if (offset > 0) {
      while (offset > 0 && this.chunkLengths.length) {
        length = this.chunkLengths[0]
        if (offset < length) length = offset
        chunk = this.read(length)
        offset -= chunk.length
      }
    }
    return this.position
  }
}
