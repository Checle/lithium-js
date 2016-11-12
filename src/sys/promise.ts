export default class SyncPromise <T> implements PromiseLike<T> {
  private promise: Promise<T>
  private value: T

  constructor (private async: (resolve: Function, reject: Function) => void, private sync?: () => T) { }

  then <S> (onFulfill?: (value: T) => any , onReject?: (reason: any) => void): PromiseLike<S> {
    if (this.promise == null) this.promise = new Promise<T>(this.async)
    return this.promise.then((value: T) => {
      this.value = value
      onFulfill(value)
    }, onReject)
  }

  valueOf (): T | this {
    if (this.hasOwnProperty('value')) return this.value
    if (this.sync) return (this.value = this.sync())
    return this
  }
}

export function promisify <T> (async?: Function, sync?: Function) {
  return function (...args: any[]) {
    return new SyncPromise<T>(
      (resolve, reject) => {
        let callback = (error, value) => {
          if (error == null) resolve(value)
          else reject(error)
        }
        async.apply(null, args.concat(callback))
      },
      () => sync(...args)
    )
  }
}
