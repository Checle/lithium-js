let handles = {}

export async function dlopen (file: string, mode: number = 0): Promise<any> {
  let handle = await System.import(file)
  let symbol = Symbol(file)

  handles[symbol] = handle

  return symbol
}

export function dlsym (handle: any, name: string): any {
  return handles[handle][name]
}

export function dlclose (handle): void {
  delete handles[handle]
}
