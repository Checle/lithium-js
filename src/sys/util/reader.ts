import {Readable} from '../types'

export default class Reader {
  constructor (public stream: Readable) {
    stream.on('data', (data: Buffer) => {
      for (let i = 0; i < data.length; i++) {
        this.bytes.push(data[i])
      }
      if (this.listeners.length) this.listeners[0]()
    })
  }

  listeners: Function[] = []
  bytes: number[] = []

  readString () {
    return new Promise<string>((resolve, reject) => {
      const bytes = []
      const read = () => {
        while (this.bytes.length) {
          let byte = this.bytes.shift()
          if (byte === 0) {
            this.listeners.shift()
            resolve(String(new Buffer(bytes)))
            break
          }
          bytes.push(byte)
        }
      }
      this.listeners.push(read)
      read()
    })
  }

  readStrings (callback: Function) {
    this.readString().then(string => {
      let result = callback(string)
      if (result) this.readStrings(callback)
    })
  }
}
