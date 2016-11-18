declare var environ: Environ
declare var stdin: File
declare var stdout: File
declare var stderr: File
declare var arguments: string[]

class Result {
  resolve: Function
  reject: Function
  valueOf: () => any

  constructor (resolve, reject, parent = null) {
    let state = 'pending'
    let value

    if (typeof resolve !== 'function') resolve = value => value
    if (typeof reject !== 'function') reject = value => value

    this.resolve = result => {
      if (state !== 'pending') return
      state = 'fulfilled'
      value = result
      resolve(value)
    }
    this.reject = reason => {
      if (state !== 'pending') return
      state = 'rejected'
      value = reason
      reject(reason)
    }
    this.valueOf = () => {
      if (state === 'rejected') throw value
      if (state === 'fulfilled') return value
      if (parent == null) throw new TypeError('Unresolved value')

      try {
        value = parent.valueOf()
        state = 'fulfilled'
        resolve(value)
        if (value === parent) throw new TypeError('Unresolved value')
        return value == null ? value : value.valueOf()
      } catch (error) {
        state = 'rejected'
        reject(error)
        throw error
      }
    }
  }
}

const constructor = Promise
const prototype = Promise.prototype
const then = Promise.prototype.then

interface Promise <T> {
  valueOf (): T
}

interface PromiseLike <T> {
  valueOf (): T
}

Promise = function (executor) {
  let result: Result

  const promise = new constructor((resolve, reject) => {
    result = new Result(resolve, reject)
  })

  executor(result.resolve, result.reject)

  promise.valueOf = result.valueOf
  return promise
} as any as PromiseConstructor

Promise.resolve = ((value) => new Promise((resolve, reject) => resolve(value))) as any
Promise.reject = ((value) => new Promise((resolve, reject) => reject(value))) as any
Promise.all = constructor.all as any
Promise.race = constructor.race as any

(Promise as any).prototype = prototype

Promise.prototype.then = function (resolve, reject): any {
  const result = new Result(resolve, reject, this)
  const promise = then.call(this, result.resolve, result.reject)

  promise.valueOf = result.valueOf
  return promise
}

Promise.prototype.catch = function (reject?: (reason: any) => void): any {
  return this.then(null, reject)
}
