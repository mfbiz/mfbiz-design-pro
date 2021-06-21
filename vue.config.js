

const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin');


const vueConfig = {
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionPlugin({
        test: /\.js$|\.html$|.\css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ],
  },

  devServer: {
    host: '0.0.0.0',
    port: 8088,
    proxy: {
      '/api/matrix/auth/ccs/login': {
        target: 'http://yunying-test.missfresh.net',
        ws: false,
        logLevel: 'debug',
        changeOrigin: true
      },
    }
  },

  productionSourceMap: false,
  transpileDependencies: [],
  lintOnSave: false

}

module.exports = vueConfig
