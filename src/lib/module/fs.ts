import 'fcntl'
import 'unistd'

const Symbols = ['access', 'chmod', 'chown', 'close', 'fchmod', 'fchown',
  'fdatasync', 'fstat', 'fsync', 'ftruncate', 'lchmod', 'lchown', 'link',
  'lstat', 'mkdir', 'open', 'readdir', 'readlink', 'realpath',
  'rename', 'rmdir', 'stat', 'symlink', 'truncate', 'unlink', 'write']

for (let name of Symbols) {
  this[name] = (...args: any[]) => {
    let callback = args.pop()
    let result = global[name](...args)
    Promise.resolve(result).then(value => callback(null, value)).catch(error => callback(error))
  }
  this[name + 'Sync'] = (...args: any[]) => {
    let result = global[name](...args)
    return Promise.resolve(result).valueOf()
  }
}
