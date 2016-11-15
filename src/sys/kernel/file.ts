import {close} from '../modules/unistd'

export default class File {
  constructor (public fd?: number) { }

  close (): PromiseLike<void> {
    return close(this.fd)
  }
  release (): void { }
}
