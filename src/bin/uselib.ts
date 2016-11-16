#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import {uselib} from 'unistd'

program
  .usage('library [module]')
  .parse(process.argv)

uselib.apply(null, program.args)
