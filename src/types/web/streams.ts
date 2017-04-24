interface ReadableStreamSource {
  start?(controller: ReadableStreamDefaultController): void | Promise<void>
  pull?(controller: ReadableStreamDefaultController): void | Promise<void>
  cancel?(reason: string): void | Promise<void>
}

interface ReadableByteStreamSource {
  start?(controller: ReadableByteStreamController): void | Promise<void>
  pull?(controller: ReadableByteStreamController): void | Promise<void>
  cancel?(reason: string): void | Promise<void>

  type: "bytes"
  autoAllocateChunkSize?: number
}

interface QueuingStrategy {
  size?(chunk: ArrayBufferView): number
  highWaterMark?: number
}

interface PipeOptions {
  preventClose?: boolean
  preventAbort?: boolean
  preventCancel?: boolean
}

interface ReadableStream {
  constructor(underlyingSource?: ReadableStreamSource, strategy?: QueuingStrategy)
  constructor(underlyingSource?: ReadableByteStreamSource, strategy?: QueuingStrategy)

  locked: boolean

  cancel(reason: string): Promise<void>
  getReader(): ReadableStreamDefaultReader
  getReader({ mode }: { mode: "byob" }): ReadableStreamBYOBReader
  pipeThrough<T extends ReadableStream>({ writable, readable }: { writable: WritableStream, readable: T }, options?: PipeOptions): T
  pipeTo(dest: WritableStream, options?: PipeOptions): Promise<void>
  tee(): [ReadableStream, ReadableStream]
}

interface ReadableStreamDefaultReader {
  constructor(stream: ReadableStream)

  closed: Promise<void>

  cancel(reason: string): Promise<void>
  read(): Promise<IteratorResult<ArrayBufferView>>
  releaseLock(): void
}

interface ReadableStreamBYOBReader {
  constructor(stream: ReadableStream)

  closed: Promise<void>

  cancel(reason: string): Promise<void>
  read(view: ArrayBufferView): Promise<IteratorResult<ArrayBufferView>>
  releaseLock(): void
}

interface ReadableStreamDefaultController {
  constructor(stream: ReadableStream, underlyingSource: ReadableStreamSource, size: number, highWaterMark: number)

  desiredSize: number

  close(): void
  enqueue(chunk: ArrayBufferView): number
  error(e: any): void
}

interface ReadableByteStreamController {
  constructor(stream: ReadableStream, underlyingSource: ReadableStreamSource, highWaterMark: number)

  byobRequest: ReadableStreamBYOBRequest
  desiredSize: number

  close(): void
  enqueue(chunk: ArrayBufferView): number
  error(e: any): void
}

interface ReadableStreamBYOBRequest {
  constructor(controller: ReadableByteStreamController, view: ArrayBufferView)

  view: ArrayBufferView

  respond(bytesWritten: number): void
  respondWithNewView(view: ArrayBufferView): void
}

interface WritableStreamSink {
  start?(controller: WritableStreamDefaultController): void | Promise<void>
  write?(chunk: any, controller?: WritableStreamDefaultController): any
  close?(controller: WritableStreamDefaultController): void | Promise<void>
  abort?(reason: string): void | Promise<void>
}

interface WritableStream {
  constructor(underlyingSink?: WritableStreamSink, strategy?: QueuingStrategy)

  locked: boolean

  abort(reason: string): Promise<void>
  getWriter(): WritableStreamDefaultWriter
}

interface WritableStreamDefaultWriter {
  constructor(stream: WritableStream)

  closed: Promise<void>
  desiredSize: number | null
  ready: Promise<void>

  abort(reason: string): Promise<void>
  close(): Promise<void>
  releaseLock(): void
  write(chunk: any): Promise<void>
}

interface WritableStreamDefaultController {
  constructor(stream: WritableStream, underlyingSink: WritableStreamSink, size: number, highWaterMark: number)

  error(e: any): void
}

interface ByteLengthQueuingStrategy {
  constructor({ highWaterMark }: { highWaterMark: number })

  size(chunk: ArrayBufferView): number | undefined
}

interface CountQueuingStrategy {
  constructor({ highWaterMark }: { highWaterMark: number })

  size(): 1
}
