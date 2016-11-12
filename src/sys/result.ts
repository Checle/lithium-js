import './default'

export default class Result <T> extends Promise<T> {
  private value: T
  private error: any
  private pending = false

  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void

  constructor (private async?: () => void, private sync?: () => T) {
    super((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
    this.then(
      value => {
        this.pending = false
        this.value = value
      },
      error => {
        this.pending = false
        this.error = error
      }
    )
  }

  then (resolve?: (value: T) => any , reject?: (reason: any) => any): PromiseLike<T> {
    if (!this.pending) {
      this.async()
      this.pending = true
    }
    return super.then(resolve, reject)
  }

  valueOf (): T {
    if (this.hasOwnProperty('value')) return this.value
    if (this.sync && !this.pending) return (this.value = this.sync())
    throw new Error('Value not resolved')
  }
}

export function promisify <T> (async?: Function, sync?: Function) {
  return function (...args: any[]) {
    let result = new Result<T>(
      () => {
        let callback = (error, value) => {
          if (error == null) result.resolve(value)
          else result.reject(error)
        }
        async.apply(null, args.concat(callback))
      },
      () => sync(...args)
    )
  }
}
