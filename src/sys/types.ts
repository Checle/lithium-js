type Readable = NodeJS.ReadableStream
type Writable = NodeJS.WritableStream
type Environ = { [name: string]: string }

interface Thenable <T> {
  then (resolve?: (value: any) => any , reject?: (reason: any) => any): Thenable<T>
}
