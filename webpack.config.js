module.exports = {
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel',
        exclude: /node_modules|bower_components/,
        query: {
          'presets': ['es2015']
        }
      }
    ]
  }
};
