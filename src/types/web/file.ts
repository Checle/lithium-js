interface BlobPropertyBag {
    type?: string;
    endings?: string;
}

interface FilePropertyBag {
    type?: string;
    lastModified?: number;
}

interface Blob {
    readonly size: number
    readonly type: string
    slice(start?: number, end?: number, contentType?: string): Blob
}

interface File extends Blob {
  constructor (parts: (ArrayBuffer | ArrayBufferView | Blob | string)[], filename: string, properties?: FilePropertyBag): File

  readonly lastModifiedDate: any
  readonly name: string
}
