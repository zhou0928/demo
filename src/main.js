import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/iconfont/iconfont.css'
import '../src/assets/css/global.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
// axios添加拦截器
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 路由导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
