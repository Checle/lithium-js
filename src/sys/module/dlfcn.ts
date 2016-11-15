export function dlopen (file: string, mode: number = 0): any {
  let id = require.resolve(file)
  require(id)
  return id
}

export function dlsym (handle: any, name: string): any {
  return require.cache[handle][name]
}

export function dlclose (handle): void {
  delete require.cache[handle]
}
