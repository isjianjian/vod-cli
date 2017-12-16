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
import detail from './components/video/detail'
import wallet from './components/mine/wallet/index'
import balance from './components/mine/wallet/balance'
import integral from './components/mine/wallet/integral'
import recharge from './components/mine/wallet/recharge'
import order from './components/mine/order'
import welcome from './components/welcome'
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
    { path: 'mine', component: mine ,meta: {allowBack: false}}
  ]
}, {path: '/detail', component: detail, meta: {allowBack: true}
},{
  path: '/mine/order', component: order
},{
  path: '/mine/wallet',
  component: wallet,
  children: [
    { path: 'balance', component: balance},
    { path: 'integral', component: integral},
    { path: 'recharge', component: recharge}
    ]
},{
  path: '/wel', component: welcome
}]

Vue.prototype.wxinfo = {
  URL: "http%3A%2F%2F19f176814r.imwork.net",
  APPID: 'wxc24d07d05cfea4d3',
  APPSECRET: 'bb4d407d1c79e3f31dddcc582077ce24',
  user:{}
}
Vue.prototype.common = {
  SERVER_URL: "http://192.168.2.6:8080/hotel_vod/",
  // SERVER_URL:"https://shengvideo.com/hotel_vod/"
  TOKEN:{},
  lastPage:''
}
Vue.prototype.current = {
  video: {},
}
Vue.prototype.api_post = function (url,success,fail) {
   if (new Date() > this.common.TOKEN.expireTime){
     window.location.reload()
   }
   if (url.indexOf("?") == -1){
     url += "?now_time=" + new Date().getTime()
   }
   var local_url = this.common.SERVER_URL + url + "&openid=" + this.wxinfo.user.unionId
        + "&token=" + this.common.TOKEN.token + "&tokenType=1"
   this.$http.post(local_url)
    .then(function (res) {
      if (res.data.code == 0){
        success(res.data)
      }else {
        if (fail != null){
          fail(res.data)
        }else {
          this.$vux.toast.text(res.data.msg,'center')
        }
      }
    },function (res) {
      this.$vux.toast.text('连接失败，请检查网络','center')
    })

}
Vue.prototype.getUrlKey = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
