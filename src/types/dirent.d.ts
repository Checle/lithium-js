declare type Dir = IterableIterator<Dirent>

declare interface Dirent {
    ino: Ino
    name: string
}

declare function opendir(dirname: string): Promise<Dir>
declare function readdir(dirp: Dir): Dirent
declare function closedir(dirp: Dir): void
