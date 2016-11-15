import * as fs from 'fs'

function createAsyncFunction <T> (async?: Function, sync?: Function): () => PromiseLike<T> {
  return function (...args: any[]): PromiseLike<T> {
    let promise

    return {
      then: (resolve, reject): Promise<T> => {
        if (!promise) {
          promise = new Promise<T>((resolve, reject) => {
            let callback = (error, value) => {
              if (error == null) resolve(value)
              else reject(error)
            }
            async.apply(null, args.concat(callback))
          })
        }
        return promise.then(resolve, reject)
      },
      valueOf: (): T => {
        if (promise) return this
        return sync.apply(null, args)
      }
    }
  }
}

const FS = ['access', 'chmod', 'chown', 'close', 'fchmod', 'fchown',
  'fdatasync', 'fstat', 'fsync', 'ftruncate', 'lchmod', 'lchown', 'link',
  'lstat', 'mkdir', 'open', 'readdir', 'readlink', 'realpath',
  'rename', 'rmdir', 'stat', 'symlink', 'truncate', 'unlink', 'write']

for (let name of FS) {
  this[name] = createAsyncFunction(fs[name], fs[name + 'Sync'])
}
