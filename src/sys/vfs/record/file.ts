export default class RecordFile implements File {
  close (): Promise<void> {
    return close(this.fd)
  }

  async read (buf?: Buffer): Promise<IteratorResult<Buffer>> {
    if (!buf) {
      buf = await read(this.fd)
    } else {
      let count = await read(this.fd, buf)
      if (count < buf.length) buf = buf.slice(0, count)
    }
    return (buf && buf.length ? { value: buf, done: false } : { done: true }) as IteratorResult<Buffer>
  }

  async write (buf: Buffer): Promise<void> {
    await write(this.fd, buf)
  }

  release (): void { }
}
