#! /usr/bin/env node

var repl = require('repl')
var Record = require('../build/r.js')

global.R = global.Record = Record
global.r = global.record = new Record

process.stdout.write('(Shortcuts R and r correspond to Record and record, respectively)\n')

repl.start('> ')
