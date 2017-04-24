let {resolveLocalFileSystemURL} = global as any


export function resolveLocalFileSystemURL(url: string): void | Promise<FileSystem> {
  let u = new URL(url)

  if (u.protocol === 'file:') {
    
  }
}
