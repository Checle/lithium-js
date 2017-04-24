declare function dlopen(file: string, mode?: number): Promise<any>
declare function dlsym(handle: any, name: string): any
declare function dlclose(handle: any): void
