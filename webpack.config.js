const path = require('path');

/*
module.exports = {
  entry: './dist/cjs/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'maplot.min.js',
    library: 'maplot',
  },
  mode: 'production',
};
*/

module.exports = {
  entry: {
    'maplot.min': './dist/cjs/index.js',
    example1: './examples/example1.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  mode: 'development',
  // mode: 'production',
};
