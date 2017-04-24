interface Flags {
    create: boolean
    exclusive?: boolean
}

interface FileWriter {
    readyState: any
    fileName: string
    length: number
    position: number
    error: FileError

    onwritestart: Function
    onprogress: Function
    onwrite: Function
    onabort: Function
    onerror: Function
    onwriteend: Function

    abort(): void
    seek(arg: number): void
    truncate(arg: number): void
    write(arg: any): void
}

interface FileSystem {
    name: string
    root: DirectoryEntry
}
declare var DirectoryEntry: {
    new(name: string, root: DirectoryEntry): DirectoryEntry
}

interface FileSystemEntry {
    isFile: boolean
    isDirectory: boolean
    name: string
    fullPath: string
    filesystem: FileSystem

    getMetadata(onSuccess?: (arg: Metadata) => void, onError?: (arg: FileError) => void): void
    setMetadata(onSuccess?: (arg: Metadata) => void, onError?: (arg: FileError) => void, options?: any): void
    toURL(): string
    remove(onSuccess?: () => void, onError?: (arg: FileError) => void): void
    getParent(onSuccess?: (arg: DirectoryEntry) => void, onError?: (arg: FileError) => void): void
}

interface FileEntry extends FileSystemEntry {
    moveTo(parentEntry: DirectoryEntry, file: string, onSuccess: (arg: DirectoryEntry) => void, onError: (arg: FileError) => void): void
    copyTo(parentEntry: DirectoryEntry, file: string, onSuccess: (arg: DirectoryEntry) => void, onError: (arg: FileError) => void): void
    createWriter(onSuccess?: (arg: FileWriter) => void, onError?: (arg: FileError) => void): void
    file(onSuccess?: (arg: File) => void, onError?: (arg: FileError) => void): void
}

interface DirectoryEntry extends FileSystemEntry {
    createReader(): DirectoryReader
    getDirectory(path: string, options: Flags, successCallback: (result: DirectoryEntry) => void, errorCallback: (error: FileError) => void): void
    getFile(path: string, options: Flags, successCallback: (result: FileEntry) => void, errorCallback: (error: FileError) => void): void
    removeRecursively(successCallback: () => void, errorCallback: (error: FileError) => void): void
}

interface DirectoryReader {
    readEntries(successCallback: (entries: FileSystemEntry) => void, errorCallback: (error: FileError) => void): void
}


/*
interface LocalFileSystem {
    requestFileSystem: Function
    resolveLocalFileSystemURI: Function
}*/

interface LocalFileSystem {
    PERSISTENT: number
    TEMPORARY: number
}
declare var LocalFileSystem: LocalFileSystem

interface Metadata {
    modificationTime: Date
}

interface FileError {
    code: number
}
declare var FileError: {
    NOT_FOUND_ERR: number
    SECURITY_ERR: number
    ABORT_ERR: number
    NOT_READABLE_ERR: number
    ENCODING_ERR: number
    NO_MODIFICATION_ALLOWED_ERR: number
    INVALID_STATE_ERR: number
    SYNTAX_ERR: number
    INVALID_MODIFICATION_ERR: number
    QUOTA_EXCEEDED_ERR: number
    TYPE_MISMATCH_ERR: number
    PATH_EXISTS_ERR: number
}

interface Window {
    requestFileSystem: any
    openDatabase(database_name: string, database_version: string, database_displayname: string, database_size: number): Database
}
