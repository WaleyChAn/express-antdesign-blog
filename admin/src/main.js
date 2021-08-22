import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import storage from './plugin/storage'
import http from './plugin/http'
import Antd from 'ant-design-vue'
import '@/assets/css/antd-variable.less'
import '@/assets/css/site.less'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$storage = storage
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
