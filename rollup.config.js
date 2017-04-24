import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'dist/index.js',
  dest: 'dist/bundle.js',
  format: 'es',
  sourceMap: true,
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    nodeGlobals(),
  ],
}
