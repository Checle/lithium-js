type FileOpenMode = 'readwrite' | 'readonly'

interface CreateFileOptions {
  ifExists?: 'replace' | 'fail'
  data?: string
}

interface OpenWriteOptions {
  ifExists?: 'replace' | 'fail'
  ifNotExists?: 'fail'
  data?: string
}

interface DestinationDict {
  name?: string
  path?: string
}

interface FileOrDirectorySequence {
}

interface Directory {
  readonly name: string

  createFile(path: string, options: CreateFileOptions): Promise<File>
  createDirectory(path: string): Promise<Directory>
  get(path: string): Promise<File | Directory>
  move(path: string | File | Directory, dest: string | Directory | DestinationDict): Promise<void>
  remove(path: string | File | Directory): Promise<boolean>
  removeDeep(path: string | File | Directory): Promise<boolean>
  openRead(path: string | File): Promise<FileHandle>
  openWrite(path: string | File, options: OpenWriteOptions): Promise<FileHandleWritable>
  getFilesAndDirectories(): Promise<FileOrDirectorySequence>
  enumerate(path: string): Observable<File | Directory>
  enumerateDeep(path: string): Observable<File>
}

interface FileHandle {
  readonly mode: FileOpenMode
  readonly active: boolean
  readonly offset: number
  size: number

  getFile (): Promise<File>
  read (size: number): CancelablePromise<ArrayBuffer>
}

interface FileHandleWritable {
  size?: number

  write(value: string | ArrayBuffer | ArrayBufferView | Blob): CancelablePromise<void>
  setSize(size?: number): Promise<void>
}

interface Navigator {
  getFileSystem(): Promise<Directory>
}

interface URL {
  getFileSystemURL(file: File): string
}
