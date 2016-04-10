import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const productionPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
]

export default {
  devtool: isDev ? 'source-map' : null,

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
    new HtmlPlugin({
      template: 'html!assets/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlPlugin({
      template: 'html!assets/contact.html',
      filename: 'contact.html',
      chunks: ['contact']
    })
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
        loader: 'file',
        query: {
          name: 'img/[name].[ext]'
        }
      }
    ]
  }
  ,

  postcss: [
    autoprefixer({browsers: ['last 2 versions']})
  ]
}
