import Record from './record/base'

if (typeof window !== 'undefined') {
  window.Record = Record
  window.record = new Record
}

export default Record
