import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import http from '@/assets/js/htp'

Vue.use(ElementUI)

Vue.prototype.$http = http
Vue.config.productionTip = false



new Vue({
  data(){
	  return{
		  token:''
	  }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
