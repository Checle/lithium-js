export class SystemError extends Error {
  constructor (public errno?, public syscall?) {
    super()
    this.message = errno
    if ('captureStackTrace' in Error) Error.captureStackTrace(this)
  }

  code = this.errno
  name = 'SystemError'
}
