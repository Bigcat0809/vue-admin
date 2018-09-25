import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import router from './router/index.js'
import store from './store/index.js'

import 'normalize.css/normalize.css' // css标准格式设置
import '@/styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
// import i18n from '@/locale'
import './icons'
import './permission.js'

Vue.use(Element, {
  size: 'small' // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // i18n,
  render: h => h(App)
}).$mount('#app')
