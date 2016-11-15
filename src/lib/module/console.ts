import {write} from 'unistd'

export default class Console {
  log (...args: any[]) {
    write(0, args.join(' '))
  }
}
