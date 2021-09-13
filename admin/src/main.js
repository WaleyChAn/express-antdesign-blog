import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import storage from './plugin/storage'
import http from './plugin/http'
import mixin from './plugin/mixin'
import utils from './plugin/utils'
import './plugin/permission'
import Antd from 'ant-design-vue'
import '@/assets/css/antd-variable.less'
import '@/assets/css/site.less'

Vue.use(Antd)
Vue.prototype.$config = config
Vue.prototype.$storage = storage
Vue.prototype.$http = http
Vue.prototype.$utils = utils
Vue.mixin(mixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
