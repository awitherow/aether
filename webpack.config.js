var webpack = require('webpack')
var path = require('path')
var CompressionPlugin = require('compression-webpack-plugin')

var nodeEnv = process.env.NODE_ENV

var config = {
  devtool: nodeEnv === 'production' ? 'cheap-module-source-map' : 'inline-eval-cheap-source-map',
  entry: [
    'promise-polyfill',
    './app/index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js',
    publicPath: '/public/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.css'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: false,
      comments: false,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
}

module.exports = config
