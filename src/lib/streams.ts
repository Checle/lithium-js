// Approximates https://streams.spec.whatwg.org/

import {Writable} from 'stream'

export default class Stream {
  dests: Writable[] = []
  chunks: Buffer[] = []

  readable = this
  writable = this

  get locked () { return false }
  get closed () { return new Promise<void>(() => undefined) }
  get desiredSize () { return Infinity }
  get ready () { return Promise.resolve() }
  async cancel (): Promise<void> { }
  close () { return this.closed }
  releaseLock () { }

  getReader (): ReadableStreamDefaultReader
  getReader (options: { mode: 'byob' }): ReadableStreamBYOBReader
  getReader (mode?): any {
    return this.readable && this
  }

  getWriter (): WritableStreamDefaultWriter {
    return this.writable && this
  }

  async write (chunk: Buffer): Promise<void> {
    this.push(chunk)
  }

  async read (buffer?: Buffer): Promise<IteratorResult<Buffer>> {
    return { done: this.chunks.length === 0, value: this.chunks.shift() } as IteratorResult<Buffer>
  }

  push (chunk: Buffer): void {
    this.chunks.push(chunk)
    for (let destination of this.dests) destination.write(chunk)
  }

  pipe <T extends Writable> (dest: Writable) {
    this.pipeTo(dest)
    return dest
  }

  async pipeTo (dest: any): Promise<void> {
    const writer = dest.writable ? dest : dest.getWriter()

    let result
    while ((result = await this.read()).done != true) writer.write(result.value)
  }

  pipeThrough <T extends ReadableStream> (duplex: { writable: WritableStream, readable: T }): T {
    this.pipeTo(duplex.writable)
    return duplex.readable
  }

  async abort (reason): Promise<void> { }

  tee (): [ReadableStream, ReadableStream] {
    return [this, this]
  }
}
