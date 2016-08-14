#! /usr/bin/env node

import repl from 'repl'
import Record from '../src/r.js'

global.R = global.Record = Record
global.r = global.record = new Record()

process.stdout.write('(Shortcuts R and r correspond to Record and record, respectively)\n')

repl.start('> ')
