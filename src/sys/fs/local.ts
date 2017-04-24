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
  'lstat', 'mkdir', 'open', 'readdir', 'readlink', 'realpath', 'read',
  'rename', 'rmdir', 'stat', 'symlink', 'truncate', 'unlink', 'write']

for (let name of FS) {
  exports[name] = FS[name] = createAsyncFunction(fs[name], fs[name + 'Sync'])
}

export async function read (filedes: number, buf?: Buffer, nbytes: number = buf && buf.length): Promise<Ssize | Buffer> {
  const read = FS['read']
  if (!buf) {
    const buffers = []
    let nbytes
    do {
      const buf = new Buffer(BUFSIZ)
      nbytes = read(filedes, buf)
      buffers.push(buf.slice(0, nbytes))
    } while (nbytes)
  }
  return read(filedes, buf, 0, nbytes, null)
}

export function mount (source: string | any, dir: string, flags?: number, data?: any): void {
  throw 'Not implemented'
}

export function unmount (dir: string, flags: number): void {
  throw 'Not implemented'
}
