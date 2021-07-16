import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Roles from '../components/power/Roles'
import Rights from '../components/power/Rights'
import Goods from '../components/goods/List'
import Params from '../components/goods/Params'
import Cate from '../components/goods/Cate'
import Order from '../components/order/Order'
import Reports from '../components/Reports'
import Add from '../components/goods/Add'

Vue.use(VueRouter)

const routes = [
  {
    // 重定向
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: Goods,
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/goods/add',
        component: Add
      }


    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
