const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const productionPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false }
  })
]

module.exports = {
  devtool: isDev ? 'source-map' : null,

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js'
  },

  devServer: {
    contentBase: 'build/',
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
      children: false
    }
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css')
  ].concat(isProd ? productionPlugins : []),

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'assets')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader?sourceMap!postcss-loader')
      },
      {
        test: /\.(svg|jpe?g|png)$/,
        loaders: [
          'file?name=img/[name].[ext]'
        ].concat(isProd ? ['image-webpack'] : [])
      }
    ]
  },

  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]
}
