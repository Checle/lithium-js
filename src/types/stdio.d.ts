declare type Fpos = number

declare const BUFSIZ = 1024
declare const EOF: symbol
declare const SEEK_CUR = 2
declare const SEEK_END = 3
declare const SEEK_SET = 1
declare const TMP_MAX: number

declare const stdin: FileHandle
declare const stdout: FileHandle
declare const stderr: FileHandle

declare function eof(stream: FileHandle): Promise<boolean>
declare function fseek(stream: FileHandle, offset: Off, whence: number): Promise<number>
declare function fread(buffer: Buffer, size: Size, nitems: Size, stream: FileHandle): Promise<Size>
declare function fwrite(buffer: Buffer, size: Size, nitems: Size, stream: FileHandle): Promise<Size>
declare function rename(old: string, newp: string): Promise<void>
declare function fopen(filename: string, mode?: string): Promise<FileHandle>
declare function fdopen(filedes: number, mode?: string): FileHandle
declare function fclose(stream: FileHandle): Promise<void>
declare function fileno(stream: FileHandle): number
declare function tmpnam(): string
declare function tempnam(dir?: string, pfx?: string): string
declare function tmpfile(): Promise<FileHandle>
