type Require = NodeRequire
type Environ = { [name: string]: string }
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

interface ReadableStream {
  read (buffer?: ArrayBufferView): Promise<IteratorResult<ArrayBufferView>>
  push (chunk: ArrayBufferView): void
  pipe <T extends NodeJS.WritableStream> (destination: T): T
}

interface WritableStream {
  write (chunk: ArrayBufferView): Promise<void>
}

interface File extends ReadableStream, WritableStream {
  close (): Promise<void>
  release (): void
}
