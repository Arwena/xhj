import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import http from '@/assets/js/htp'
// import http from '@/assets/js/mhtp'

// 测试拦截
// import '@/mock/api'

import './assets/theme/common.less'
Vue.use(ElementUI)

Vue.prototype.$http = http
Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
