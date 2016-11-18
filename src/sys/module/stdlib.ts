import Process from '../kernel/process'

export function exit (status: number): Promise<void> {
  Process.current.cancel(status || null)

  // Promise that does not resolve
  return new Promise<void>(() => null)
}
