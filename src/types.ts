type Environ = { [name: string]: string }

interface CancelablePromise<T> extends Promise<T> {
  cancel(): Promise<void> | void
}

interface Observable<T> {
  subscribe(onchange: (value: any) => any): void
}
