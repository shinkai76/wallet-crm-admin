const path = require('path')
const name = 'CRM SYSTEM'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  pwa: {
    name: name
  },
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 5080,
    open: true,
    proxy: {
      '/nuvateq': {
        target: 'http://192.168.0.110:9099/',
        changeOrigin: true,
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // provide the app's title in html-webpack-plugin's options list so that
    // it can be accessed in index.html to inject the correct title.
    // https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })

          config.optimization.runtimeChunk('single')
          // 给js和css配置版本号
          // config.plugin('extract-css').tap(() => [{
          //     filename: `static/css/[name].${Timestamp}.css`,
          //     chunkFilename: `static/css/[name].${Timestamp}.css`
          // }])
          // config.output.filename('static/js/[name].' + Timestamp + '.js').end();
          // config.output.chunkFilename('static/js/[name].' + Timestamp + '.js').end();
        }
      )
    config.plugin('html').tap(args => {
      args[0].title = name
      return args
    })
  }
}
