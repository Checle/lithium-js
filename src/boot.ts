#!/usr/bin/node

import './lib/libc'
import './lib/libweb'
import 'isomorphic-fetch'
import 'url-polyfill'
import 'web-streams-polyfill'
import Process from './sys/kernel/process'
import {install} from './modules/sys/record'
// import {mount} from './modules/sys/mount'

// require('source-map-support').install()

let location = global['location']

if (location == null) {
  let filename = typeof __filename !== 'undefined' ? __filename : typeof __moduleName !== 'undefined' ? __moduleName : undefined

  if (filename != null) {
    location = new URL(filename, 'file:///')
  }
}

let root = decodeURIComponent(location.pathname).substr(1).replace(/[^/\\]+$/, '')

if (typeof process !== 'undefined') {
  global['arguments'] = process.argv

  process.on('unhandledRejection', (reason, promise) => { throw reason })
}

install(root + '/sys/fs/local')

global['environ'] = {
  PATH: ['bin', 'usr/bin'].map(pathname => [root, pathname].join('/')).join(':'),
  JSPATH: ['lib', 'usr/lib', 'usr/include'].map(pathname => root + '/' + pathname).join(':'),
}

global['location'] = location

/*
mount(local, '/usr/local')
mount(__dirname, '/')
*/
