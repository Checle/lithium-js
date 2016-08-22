import Record from './record/base'

declare var window
if (typeof window !== 'undefined') {
  window.Record = Record
  window.record = new Record()
}

export default Record

module.exports = Record
