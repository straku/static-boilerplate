const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlPlugin = require('html-webpack-plugin')

const config = require('./webpack.config')

const mainPath = './assets'

function fileFactory (path) {
  let html = []
  let js = []

  return {
    init () {
      return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
          if (err) reject(err)
          files.forEach(file => {
            const [name, ext] = file.split('.')
            if (ext === 'html') html.push(name)
            if (ext === 'js') js.push(name)
          })
          resolve({ html, js })
        })
      })
    },

    getFiles () {
      return { html, js }
    },

    getPath () {
      return path
    }
  }
}

function addClientEntry (entries) {
  const clientEntry = 'webpack-dev-server/client?http://localhost:3000/'
  return Object.keys(entries).reduce((acc, item) => {
    const entry = entries[item]
    return Object.assign(acc, {
      [item]: Array.isArray(entry)
        ? [clientEntry].concat(entry)
        : [clientEntry, entry]
    })
  }, {})
}

function getChunks ({ html, js }) {
  const entry = {}
  const plugins = []
  html.forEach(file => {
    if (js.includes(file)) {
      entry[file] = `${mainPath}/${file}.js`
      plugins.push(new HtmlPlugin({
        template: `html!${mainPath}/${file}.html`,
        filename: `${file}.html`,
        chunks: [file]
      }))
    } else {
      plugins.push(new HtmlPlugin({
        template: `html!${mainPath}/${file}.html`,
        filename: `${file}.html`
      }))
    }
  })
  return ({ entry, plugins })
}

function createCompiler (baseConfig, { entry, plugins }) {
  const finalConfig = Object.assign({}, baseConfig, {
    entry: addClientEntry(Object.assign({}, baseConfig.entry, entry)),
    plugins: (baseConfig.plugins || []).concat(plugins)
  })
  return webpack(finalConfig)
}

function run (path) {
  fileFactory(path)
    .init()
    .then(baseFiles => {
      const compiler = createCompiler(config, getChunks(baseFiles))
      const server = new WebpackDevServer(compiler, config.devServer)
      server.listen(3000, () => console.log('Server listening on port 3000'))
    })
}

run(mainPath)
