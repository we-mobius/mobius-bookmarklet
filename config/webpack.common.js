const path = require('path')
const resolve = dir => path.resolve(__dirname, '../', dir)

module.exports = {
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: []
  },
  plugins: [],
  resolve: {
    extensions: ['.js'],
    alias: {
      MobiusUI$: resolve('src/libs/mobius-ui.js'),
      MobiusJS$: resolve('src/libs/mobius-js.js'),
      MobiusUtils$: resolve('src/libs/mobius-utils.js'),
      Libs: resolve('src/libs/'),
      Interface: resolve('src/interface/'),
      Business: resolve('src/business/')
    },
    symlinks: false
  }
}
