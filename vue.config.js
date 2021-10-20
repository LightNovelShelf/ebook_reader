const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  chainWebpack: (config) => {
    // 特殊处理read.scss
    {
      config.module
        .rule('scss')
        .oneOf('read.scss')
        .before('normal')
        .test(/read\.scss$/)

      config.module
        .rule('scss')
        .oneOf('read.scss')
        .use('file-loader')
        .loader('file-loader')
        .options({ name: 'css/[contenthash].css' })

      const cssConfig = config.module.rule('scss').oneOf('normal').uses
      config.module
        .rule('scss')
        .oneOf('read.scss')
        .uses.set('postcss-loader', cssConfig.get('postcss-loader'))
        .set('sass-loader', cssConfig.get('sass-loader'))
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
