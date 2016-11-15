declare var environ: Environ

interface Object extends Thenable<Object> {
  catch (reject?: (reason: any) => any): this
}

Object.prototype.then = function (resolve?: (value: any) => any , reject?: (reason: any) => any): Object {
  let value = this.valueOf()
  let then = resolve
  while (typeof then === 'function') {
    let result = then(value)
    then = result != null && result.then
  }
  return this
}

Object.prototype.catch = function (onReject?: Function): Object {
  return this.then(null, onReject)
}

function createResult (resolve, reject, parent = null) {
  let state = 'pending'
  let value

  return {
    resolve: result => {
      if (state !== 'pending') return
      state = 'fulfilled'
      value = result
      resolve(value)
    },
    reject: reason => {
      if (state !== 'pending') return
      state = 'rejected'
      value = reason
      reject(reason)
    },
    valueOf: () => {
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
    },
  }
}

const prototype = Promise.prototype
const then = Promise.prototype.then

interface Promise <T> {
  valueOf (): T
}

interface PromiseLike <T> {
  valueOf (): T
}

Promise = function (executor) {
  let result: any

  const promise = new Promise((resolve, reject) => {
    result = createResult(resolve, reject)
  })

  executor(result.resolve, result.reject)

  promise.valueOf = result.valueOf
  return promise
} as any as PromiseConstructor

(Promise as any).prototype = prototype

Promise.prototype.then = (resolve, reject): any => {
  const result = createResult(resolve, reject, this)
  const promise = then.call(this, result.resolve, result.reject)

  promise.valueOf = result.valueOf
  return promise
}
