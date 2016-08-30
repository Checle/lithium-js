export class SystemError extends Error {
  constructor (public errno?, public syscall?) {
    super()
    this.message = errno
    if ('captureStackTrace' in Error) Error.captureStackTrace(this)
  }

  code = this.errno
  name = 'SystemError'
}

export function catchError (func) {
  return function (...args) {
    try { return func.apply(this, args) }
    catch (error) { this.emit('error', error) }
  }
}
