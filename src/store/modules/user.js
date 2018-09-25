import { redis } from '@/api/kjdp'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'text/xml; charset=utf-8'

const user = {
  state: {
    userId: '', // 用户编号
    logIp: '', // 登录ip
    dwbh: '', // 单位编号
    dq: '', // 单位名称
    userName: '', // 用户名
    userPass: '', // 用户串
    userRole: '', // 用户权限
    userTicketInfo: '', // 用户令牌
    jsbh: '', // 编号01
    ptbh: '', // 编号02
    userFlag: '1' // 业务用途
  },
  mutations: {
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_LOG_IP: (state, logIp) => {
      state.logIp = logIp
    },
    SET_DWBH: (state, dwbh) => {
      state.dwbh = dwbh
    },
    SET_DQ: (state, dq) => {
      state.dq = dq
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_USER_PASS: (state, userPass) => {
      state.userPass = userPass
    },
    SET_USER_ROLE: (state, userRole) => {
      state.userRole = userRole
    },
    SET_USER_TICKET_INFO: (state, userTicketInfo) => {
      state.userTicketInfo = userTicketInfo
    },
    SET_JSBH: (state, jsbh) => {
      state.jsbh = jsbh
    },
    SET_PTBH: (state, ptbh) => {
      state.ptbh = ptbh
    }
  },
  actions: {
    getKaUser ({ commit }) {
      return new Promise((resolve, reject) => {
        redis().then(res => {
          commit('SET_USER_ID', res.USER_CODE)
          commit('SET_LOG_IP', res.LOG_IP)
          commit('SET_DWBH', res.DWBH)
          commit('SET_DQ', res.DQ)
          commit('SET_USER_NAME', res.USER_NAME)
          commit('SET_USER_PASS', res.USER_PASS)
          commit('SET_USER_ROLE', res.USER_ROLE)
          commit('SET_USER_TICKET_INFO', res.USER_TICKET_INFO)
          commit('SET_JSBH', res.JSBH)
          commit('SET_PTBH', res.PTBH)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
