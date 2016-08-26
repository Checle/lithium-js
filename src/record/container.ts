import { Duplex } from 'stream'

import * as interfaces from '../interfaces'

export default class Container extends Duplex implements interfaces.Container {
  path
  position
  bytesWritten

  stop () { }
  close () { }
  _write () { }
}

export class BrowserContainer extends Container {
}

export class NodeContainer extends Container {
}