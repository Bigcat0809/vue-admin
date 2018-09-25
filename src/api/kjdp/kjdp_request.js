import axios from 'axios'
import { Message } from 'element-ui'

// ------axios全局配置--------*/
let api = process.env.NODE_ENV === 'development' ? '' : (document.location.protocol + '//' + window.location.host)

// create an axios instance
const service = axios.create({
  baseURL: api, // api的base_url
  timeout: 10000
})

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'text/xml; charset=utf-8'

// http request 拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// http respone 拦截器
service.interceptors.response.use(
  response => {
    let answers = {}
    let msg = []
    if (response.data.ANSWERS.length) {
      // console.log(response.data.ANSWERS)
      for (var i = 0, len = response.data.ANSWERS.length; i < len; i++) {
        answers.data = response.data.ANSWERS[i].ANS_COMM_DATA[0]
        answers.code = response.data.ANSWERS[i].ANS_MSG_HDR.MSG_CODE
        answers.msg = response.data.ANSWERS[i].ANS_MSG_HDR.MSG_TEXT
        answers.time = response.data.ANSWERS[i].ANS_MSG_HDR.RUN_TIMES
        answers.len = response.data.ANSWERS[i].ANS_MSG_HDR.DATA_ROWS
        if (answers.code !== '0') {
          // 预留错误信息调用 日志接口
          let errMsg = answers.msg || '未知错误,请联系管理员查询异常！'
          Promise.reject(errMsg)
          Message.error(errMsg)
        }
        msg.push(answers)
      }
      return msg
    } else {
      return response.data
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400 :
          Message('请求错误')
          break
        case 401:
          Message('没有操作权限')
          break
        case 404:
          Message(`请求地址出错: ${error.response.config.url}`)
          break
        case 408:
          Message('请求超时')
          break
        case 500:
          Message('服务器出了小问题')
          break
        case 501:
          Message('服务未实现')
          break
        case 502:
          Message('网关错误')
          break
        case 503:
          Message('服务不可用')
          break
        case 504:
          Message('网关超时')
          break
        case 505:
          Message('HTTP版本不受支持')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default service
