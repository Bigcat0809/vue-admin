/*
 * kjdp_interFace_api
 * kjdp框架api
 * */
import request from '@/api/kjdp/kjdp_request'
import { encrypt } from '@/api/kjdp/des'
import { Message } from 'element-ui'

const apiUrl = '/work_platform/redis_ajax'

export function KJDPservice (param) {
  let requests = param || [{}]
  for (let i = 0, len = requests.length; i < len; i++) {
    if (typeof (requests[i].service) !== 'undefined' && requests[i].service === 'P9999999' && (typeof (requests[i].bex_codes) === 'undefined' || requests[i].bex_codes === '')) {
      Message('请求配置错误:未配置bexcode！')
      return
    }
    if (typeof (requests[i].bex_codes) === 'string' && typeof (requests[i].service) === 'undefined') {
      requests[i].service = 'P9999999'
    }
  }
  let reqType = 'json'
  let requestStr
  if (reqType === 'json') {
    requests = makeJsonRequest(requests)
    // for (let i = 0, len = requests.length; i < len; i++) {
    //   if (requests[i].REQ_COMM_DATA.BPM_OP === 'completeTask' ||
    //   requests[i].REQ_COMM_DATA.BPM_OP === 'deleteProcessInstanceWithoutCascade' ||
    //   requests[i].REQ_COMM_DATA.BPM_OP === 'rollbackTask' ||
    //   requests[i].REQ_COMM_DATA.BPM_OP === 'startProcessByForm') {
    //     requests[i].REQ_MSG_HDR.OP_CODE = requests[i].REQ_COMM_DATA.USER_ID
    //   }
    // }
    requestStr = `{"REQUESTS":${JSON.stringify(requests)}}`
  }
  // 加密入参
  requestStr = encrypt(requestStr)
  return request({
    url: `${apiUrl}?returnType=json`,
    method: 'post',
    data: requestStr
  })
}

function makeJsonRequest (requests) {
  var jsonPack = []
  for (let i = 0, len = requests.length; i < len; i++) {
    jsonPack[i] = {}
    jsonPack[i].REQ_MSG_HDR = getKSDXReqMsgHead(requests[i])
    jsonPack[i].REQ_COMM_DATA = requests[i]
  }
  return jsonPack
}

function getKSDXReqMsgHead () {
  let reqMsgHeader = {
    'OP_CODE': '',
    'OP_ROLE': '',
    'OP_BRANCH': '',
    'OP_SITE': '',
    'USER_TICKET_INFO': '',
    'OP_WAY': '1',
    'OP_LANGUAGE': '1',
    'OP_PROGRAM': 'menuId',
    'SERVER_ID': 'service',
    'MSG_ID': 'service'
  }
  return reqMsgHeader
}

export function redis () {
  return request({
    url: `/work_platform/redis_session?returnType=json` + Math.random(),
    method: 'get'
  })
}
