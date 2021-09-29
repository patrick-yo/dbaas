// 代理可以解决的原因：
// 因为客户端请求服务端的数据是存在跨域问题的，
// 而服务器和服务器之间可以相互请求数据，
// 是没有跨域的概念（如果服务器没有设置禁止跨域的权限问题），
// 也就是说，我们可以配置一个代理的服务器可以请求另一个服务器中的数据，
// 然后把请求出来的数据返回到我们的代理服务器中，
// 代理服务器再返回数据给我们的客户端，这样我们就可以实现跨域访问数据。

module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      '/api': {
        target: 'http://192.168.242.200:9090',//后端接口地址
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    // before: app => {}
  }
};