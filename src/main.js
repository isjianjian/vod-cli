// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import App from './App'
import Home from './components/Home'
import video from './components/video/index'
import room from './components/room/index'
import shop from './components/shop/index'
import mine from './components/mine/index'


Vue.use(VueRouter)
Vue.use(Resource)

const routes = [{
  path: '/',
  component: Home,
  children: [
    { path: '/', component: video },
    { path: 'video', component: video },
    { path: 'room', component: room },
    { path: 'shop', component: shop },
    { path: 'mine', component: mine }
  ]
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
