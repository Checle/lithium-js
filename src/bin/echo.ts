import 'boot'

export default function (...strings: string[]) {
  write(1, strings.join(' '))
}
