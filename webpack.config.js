var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './assets/index.js',
    contact: './assets/contact.js'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/[name].js'
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: 'assets/contact.html',
      filename: 'contact.html',
      chunks: ['contact']
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'assets')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader!postcss-loader')
      }
    ]
  },

  postcss: [
    require('autoprefixer')({browsers: ['last 2 versions']})
  ]
};
