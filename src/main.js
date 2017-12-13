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
import order from './components/mine/order'
import { WechatPlugin,LoadingPlugin,ToastPlugin} from 'vux'
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(VueRouter)
Vue.use(Resource)
Vue.use(WechatPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

const routes = [{
  path: '/',
  component: Home,
  children: [
    { path: '/', component: video ,meta: {allowBack: false}},
    { path: 'video', component: video ,meta: {allowBack: false}},
    { path: 'room', component: room ,meta: {allowBack: false}},
    { path: 'shop', component: shop ,meta: {allowBack: false}},
    { path: 'mine', component: mine ,meta: {allowBack: false},
    }
  ]
},{
  path: '/mine/order', component: order
}]

Vue.prototype.wxinfo = {
  URL:"http%3A%2F%2F19f176814r.imwork.net",
  APPID : 'wxc24d07d05cfea4d3',
  APPSECRET : 'bb4d407d1c79e3f31dddcc582077ce24',
  user:{}
}
Vue.prototype.common = {
  // SERVER_URL:"https://shengvideo.com/hotel_vod/"
  SERVER_URL:"http://192.168.2.6:8080/hotel_vod/",
  TOKEN:{}
}

Vue.prototype.getUrlKey = function(name){
  return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  next()
  let allowBack = true    //    给个默认值true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  if (!allowBack) {
    history.pushState(null, null, location.href)
  }
  // store.dispatch('updateAppSetting', {
  //   allowBack: allowBack
  // })
})
FastClick.attach(document.body)

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
