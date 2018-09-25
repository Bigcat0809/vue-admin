const path = require('path')
// const fs = require('fs')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  baseUrl: '', // 部署应用时的基本 URL
  outputDir: 'dist', // 生产环境构建文件的目录
  // assetsDir: 'src/assets', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  // indexPath: 'index.html', // 指定生成的 index.html 的输出路径
  filenameHashing: true, // 生成的静态资源文件名是否使用哈希
  lintOnSave: false,
  productionSourceMap: false, // 生产环境构建map文件
  integrity: false,
  // configureWebpack: {

  // },
  devServer: {
    // port: 8087,
    // host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'www.baidu.com', // 目标主机
        ws: true, // 需要虚拟主机站点
        changeOrigin: true, // 代理的WebSockets
        pathRewrite: {
          '^/api/old-path': '/api/new-path' // rewrite path
        },
        router: {
          // 覆盖目标'http://www.example.org'到'的http：//本地主机：8000'
          'dev. localhost:3000': 'http://localhost:8000'
        }
      },
      '/work_platform': {
        target: 'http://127.0.0.1:8688/work_platform', // http://192.168.25.15:7011 http://127.0.0.1:8081 http://10.33.9.180:8103
        changeOrigin: true,
        pathRewrite: {
          '^/work_platform': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  }
}
