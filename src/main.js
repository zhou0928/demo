import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element.js'
import '@/assets/css/iconfont/iconfont.css'
import '../src/assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'


// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)

import vRegion from 'v-region'
Vue.use(vRegion)
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

Vue.component('tree-table', TreeTable)

// 创建时间过滤器

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')   //不足两位时以0填充
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
