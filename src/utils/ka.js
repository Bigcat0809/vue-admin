import axios from 'axios'
import { encrypt, encryptUser } from '@/api/kjdp/des'
axios.defaults.headers.post['Content-Type'] = 'text/xml; charset=utf-8'

export function getDict (zdmc, zdqz) {
  var arr = []
  axios.get(`/work_platform/kjdp_cache?cacheType=dictCacheOld&keyCode=${zdmc}&r${Math.random()}`).then(res => {
    for (let i = 0, len = res.data[zdmc].length; i < len; i++) {
      arr.push({
        ZDQZ: res.data[zdmc][i].ZDQZ,
        QZSM: res.data[zdmc][i].QZSM
      })
    }
  }).catch(err => {
    console.log(err)
  })
  return arr
}

export function login (zdmc, zdqz) {
  var params = {
    USER_CODE: '1',
    TRD_PWD: encryptUser('1', '888888'),
    USER_QRHM: '1',
    validateCode: '1'
  }
  var requestXmlStr = encrypt(makeXmlRequestStr([params]))
  axios({
    method: 'post',
    url: '/work_platform/redis_validate_login',
    data: requestXmlStr
  }).then(res => {
    console.log(res)
    axios({
      method: 'post',
      url: '/work_platform/redis_login',
      data: requestXmlStr
    }).then(res1 => {
      console.log(res1)
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}

/**
 * 拼请求后台字符串
 * @param json json对象
 * @returns {String} xml格式请求字符串
 */
export function makeXmlRequestStr (json) {
  var xmlRequestStr = '<?xml version="1.0" encoding="UTF-8"?><requests><![CDATA['
  // json对象转json字符串
  var paramJson = jsonArryToString(json)
  xmlRequestStr += paramJson
  xmlRequestStr += ']]></requests>'
  return xmlRequestStr
}

/**
 * 将json转换成string,构造输入请求格式json字符串，给makeXmlRequestStr函数用
 * @param json
 * @returns {String}
 */
export function jsonArryToString (json) {
  var a = ''
  let tpl = '{0}:"{1}"'
  for (var i = 0, len = json.length; i < len; i++) {
    var temp = '{'
    for (var name in json[i]) {
      var b = tpl.replace('{0}', name).replace('{1}', json[i][name])
      temp += temp === '{' ? b : ',' + b
    }
    temp += '}'
    // 遍历完一条请求
    a += a === '' ? temp : ',' + temp
  }
  return '{req:[' + a + ']}'
}
