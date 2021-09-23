const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/theme.less')]
    }
  },
  outputDir: path.resolve('../server/public/admin'),
  publicPath: process.env.NODE_ENV === 'production'
    ? '/admin/'
    : '/'
}
