import * as fetch from 'node-fetch'

export default fetch as (url: RequestInfo, init?: RequestInit) => Promise<Response>
