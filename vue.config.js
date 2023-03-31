module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false
    },
    devServer: {
      allowedHosts: ['localhost', 'host.docker.internal'],
      https: true
    }
  },
  css: {
    extract: true
  }
}
