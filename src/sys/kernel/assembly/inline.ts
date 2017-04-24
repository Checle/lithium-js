import {Zone} from 'operate'

export default class InlineVm extends Zone implements CancelablePromise<any> {
  async eval (code: string): Promise<any> {
  }
}
