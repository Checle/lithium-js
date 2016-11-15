export class SystemError extends Error {
  constructor (message: string, public code: string) {
    super(message)
    if ('captureStackTrace' in Error) Error.captureStackTrace(this)
  }
  name = 'SystemError'
}
