#!/usr/bin/node

import './sys/global'

import * as local from './sys/lib/io/local'
import {posix as path} from 'path'
import {uselib} from 'unistd'
import {mount} from 'sys/mount'

environ = {
  PATH: ['bin', 'usr/bin'].map(pathname => path.resolve(pathname)).join(':'),
  JSPATH: ['sys/module', 'lib/module', 'usr/lib/module', 'usr/lib/node_modules', 'usr/include'].map(pathname => path.resolve(pathname)).join(':'),
}

uselib('lib/io/local')

mount(local, '/usr/local')
mount(__dirname, '/')
