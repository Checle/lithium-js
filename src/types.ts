type Environ = { [name: string]: string }
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

interface File extends ReadableStream {
  close (): Promise<void>
  release (): void
}

interface CancelablePromise<T> extends Promise<T> {
  cancel(): void
}
