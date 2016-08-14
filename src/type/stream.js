import stream from 'stream'

/**
 * Standard IO stream enhanced by string and seeking capabilities.
 */
export default class Stream extends stream.PassThrough {
  constructor () {
    super()

    this.head = []
    this.chunkLengths = []
    this.position = 0
  }

  toString () {
    var buffer = this.read()
    if (buffer == null) buffer = ''
    else this.unshift(buffer)
    return String(buffer)
  }

  push (chunk, encoding) {
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

  read (size) {
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
        offset += chunk.length
        this.unshift(chunk)
      }
      // Add remainder to head
      if (offset > 0) {
        this.head.push(this.read(offset))
      }
    } else if (offset > 0) {
      while (offset > 0 && this.chunkLengths.length) {
        length = this.chunkLengths[0]
        if (offset < length) length = offset
        chunk = this.read(length)
        offset -= chunk.length
        this.head.push(chunk)
      }
    }
    return this.position
  }
}
