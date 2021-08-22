import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/admin/api'
})

// req
http.interceptors.request.use(config => {
  if (Vue.prototype.$storage.get('token')) {
    config.headers.Authorization = 'Bearer ' + Vue.prototype.$storage.get('token')
  }
  return config
}, err => {
  return Promise.reject(err)
})

// res
http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.massage) {
    Vue.prototype.$message.error(err.response.data.massage)
  }
  return Promise.resolve(err)
})

export default http
