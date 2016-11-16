type Readable = NodeJS.ReadableStream
type Writable = NodeJS.WritableStream
type Result <T> = Promise<T>
type Environ = { [name: string]: string }
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

interface Thenable <T> {
  then (resolve?: (value: any) => any , reject?: (reason: any) => any): Thenable<T>
}
