import './default'

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
      if (parent == null) throw new TypeError('Unresolved at runtime')

      try {
        value = parent.valueOf()
        state = 'fulfilled'
        resolve(value)
        if (value === parent) throw new TypeError('Unresolved at runtime')
        return value == null ? value : value.valueOf()
      } catch (error) {
        state = 'rejected'
        reject(error)
        throw error
      }
    },
    then: (resolve, reject): any => {
      const result = createResult(resolve, reject, this)
      const promise = Promise.prototype.then.call(this, result.resolve, result.reject)

      promise.valueOf = result.valueOf
      promise.then = result.then
      return promise
    },
  }
}

export default Result as any as PromiseConstructor

function Result (executor) {
  let result: any

  const promise = new Promise((resolve, reject) => {
    result = createResult(resolve, reject)
  })

  executor(result.resolve, result.reject)

  promise.valueOf = result.valueOf
  promise.then = result.then
  return promise
}

Result.prototype = Promise.prototype
