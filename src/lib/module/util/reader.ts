import {read} from 'unistd'

export default class Reader {
  constructor (public fd: number) { }

  async readBuffer (): Promise<Buffer> {
    const bytes = []

    let buffer = new Buffer(1)
    while (await read(this.fd, 1, buffer) && buffer[0]) bytes.push(buffer[0])

    return new Buffer(bytes)
  }

  async readString (): Promise<string> {
    return String(await this.readBuffer())
  }
}
