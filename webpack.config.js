const webpack = require('webpack')
const path = require('path')

const devtool = 'source-map'
const root = [path.resolve('src/sys/module'), path.resolve('src/lib'), path.resolve('node_modules')]
const tsLoader = { test: /\.ts$/, loader: 'ts-loader' }
const extensions = ['', '.js', '.ts', '.tsx']

const lib = {
  target: 'web',
  entry: './src/lib/record',
  output: {
    filename: 'record.js',
    path: 'lib',
  },
  module: {
    loaders: [
      tsLoader,
    ],
  },
  resolve: {
    alias: {
      'fetch': 'whatwg-fetch'
    },
    extensions,
    root,
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
  ],
  devtool,
}

const bin = {
  target: 'node',
  entry: './src/bin/record',
  output: {
    filename: 'record.js',
    path: 'bin',
  },
  resolve: {
    extensions,
    root,
  },
  devtool,

  // TODO: Remove when https://github.com/webpack/webpack/issues/2168 is implemented
  module: {
    loaders: [
      {
        test: /\/bin\//,
        exclude: /\/node_modules\//,
        loader: 'shebang',
      },
      tsLoader,
    ],
  },
  plugins: [
      new webpack.BannerPlugin('#!/usr/bin/node', { raw: true })
  ],
}

module.exports = [bin, lib]
