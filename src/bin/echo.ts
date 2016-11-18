import 'boot'
import {write} from 'unistd'

export default function (...strings: string[]) {
  write(1, strings.join(' '))
}
