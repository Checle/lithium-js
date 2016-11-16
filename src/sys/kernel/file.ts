import {close, read} from 'unistd'
import {Size} from 'stdio'

export default class File {
  constructor (public fd?: number) { }

  close (): Promise<void> {
    return close(this.fd)
  }

  async read (ptr?: TypedArray, size?: Size, nitems?: Size): Promise<Size> {
    size = size == null || nitems == null ? null : size * nitems

    let buffer = ptr ? Buffer.from(ptr.buffer.slice(ptr.byteOffset)) : new Buffer(size)
    return await read(this.fd, size, buffer)
  }

  release (): void { }

  pipe (destination: Writable): Writable {
    const read = async () => {
      let chunk
      while ((chunk = await this.read())) destination.write(chunk)
    }
    read()
    return destination
  }
}
