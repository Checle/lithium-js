declare type Fpos = number

declare const BUFSIZ = 1024
declare const EOF: symbol
declare const SEEK_CUR = 2
declare const SEEK_END = 3
declare const SEEK_SET = 1
declare const TMP_MAX: number

declare function eof(stream: any): Promise<boolean>
declare function fseek(stream: any, offset: Off, whence: number): Promise<number>
declare function fread(buffer: Buffer, size: Size, nitems: Size, stream: any): Promise<Size>
declare function fwrite(buffer: Buffer, size: Size, nitems: Size, stream: any): Promise<Size>
declare function rename(old: string, newp: string): Promise<void>
declare function fopen(filename: string, mode?: string): Promise<any>
declare function fdopen(filedes: number, mode?: string): any
declare function fclose(stream: any): Promise<void>
declare function fileno(stream: any): number
declare function tmpnam(): string
declare function tempnam(dir?: string, pfx?: string): string
declare function tmpfile(): Promise<any>
