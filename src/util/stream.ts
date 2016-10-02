import * as stream from 'stream'

/**
 * Standard IO stream enhanced by string and seeking capabilities.
 */
export default class Readable extends stream.Readable {
  private head
  private chunkLengths
  private pos
  private len

  constructor (source?: any) {
    super()

    this.head = []
    this.chunkLengths = []
    this.pos = 0
    this.len = 0

    if (source != null) {
      if (source && Readable.isReadable(source)) {
        source.pipe(this)
      } else {
        this.push(source)
      }
    }
  }

  static isReadable (stream: any) {
    return stream && stream.readable === true
  }

  valueOf (): Buffer {
    let buffer = super.read() // Read causes readable to copy chunks into single buffer
    if (buffer != null) this.unshift(buffer) // Add back single buffer as a single chunk
    return buffer
  }

  toString (): string {
    return String(this.valueOf())
  }

  push (chunk: any, encoding?: string): boolean {
    if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string') chunk = String(chunk)

    let length = chunk.length
    let result = super.push(chunk, encoding)
    if (!result) return false

    this.len += length
    this.chunkLengths.push(length)
    return true
  }

  unshift (chunk: any): any {
    if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string') chunk = String(chunk)

    let length = chunk.length
    let result = super.unshift(chunk)
    if (result) return false

    this.len += result
    this.chunkLengths.unshift(length)
    return true
  }

  read (size?: number): any {
    let result = super.read(size)
    if (result == null) return null
    let length = result.length

    this.head.push(result)
    this.pos += length
    this.len -= length
    while (length > 0 && this.chunkLengths.length) {
      length -= this.chunkLengths.shift()
    }
    // Add remaining chunk length
    if (length < 0) {
      this.chunkLengths.unshift(-length)
    }
    return result
  }

  seek (offset?: number): number {
    let chunk, length

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
    return this.pos
  }

  get length (): number {
    return this.len
  }

  get position (): number {
    return this.pos
  }

  _read () { return }
}
