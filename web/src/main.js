import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './plugin/http'
import logs from './plugin/logs'
import '@/assets/css/font-awesome.css'
import '@/assets/css/site.scss'

Vue.config.productionTip = false
Vue.prototype.$http = http

router.afterEach(() => {
  logs()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
