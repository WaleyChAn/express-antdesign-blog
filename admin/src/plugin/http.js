import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.massage) {
    Vue.prototype.$message.error(err.response.data.massage)
  }
  return Promise.reject(err)
})

export default http
