#!/usr/bin/node

import record from 'record'
import {Integer} from 'record'

declare var crypto

async function hash() {
  let message = await record()
  let number = await record(Integer)

  if (message == null) return 'hash:'

  let content = crypto.hash(message)

  return content
}

record(hash)
