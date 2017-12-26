// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import App from './App'
import Home from './components/Home'
import video from './components/video/index'
import search from './components/video/search'
import record from './components/video/record'
import bought from './components/video/bought'
import discounts from './components/video/discounts'
import room from './components/room/index'
import shop from './components/shop/index'
import mine from './components/mine/index'
import detail from './components/video/detail'
import buy from './components/video/buy'
import pay from './components/video/pay'
import act from './components/video/act'
import wallet from './components/mine/wallet/index'
import balance from './components/mine/wallet/balance'
import integral from './components/mine/wallet/integral'
import  aboutindex from './components/mine/about/index'
import advice from './components/mine/about/advice'
import agree from './components/mine/about/agree'
import about from './components/mine/about/about'
import recharge from './components/mine/wallet/recharge'
import order from './components/mine/order'
import welcome from './components/welcome'
import recharge_msg from './components/mine/wallet/msg'

import {WechatPlugin, LoadingPlugin, ToastPlugin, AlertPlugin} from 'vux'
import {ConfirmPlugin} from 'vux'

Vue.use(ConfirmPlugin)
Vue.use(VueRouter)
Vue.use(Resource)
Vue.use(WechatPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)

const routes = [{
  path: '/',
  component: Home,
  children: [
    {path: '/', component: video, meta: {allowBack: false, title: '点播'}},
    {path: '/video', component: video, meta: {allowBack: false, title: '点播'}},
    {path: '/room', component: room, meta: {allowBack: false, title: '订房'}},
    {path: '/shop', component: shop, meta: {allowBack: false, title: '购物'}},
    {path: '/mine', component: mine, meta: {allowBack: false, title: '我的'}}
  ]
}, {
  path: '/detail', component: detail, meta: {allowBack: true, title: '详情'}
}, {
  path: '/search', component: search, meta: {allowBack: true, title: '搜索'}
}, {
  path: '/record', component: record, meta: {allowBack: true, title: '历史记录'}
}, {
  path: '/bought', component: bought, meta: {allowBack: true, title: '已购买影片'}
}, {
  path: '/discounts', component: discounts, meta: {allowBack: true, title: '优惠影片'}
}, {
  path: '/video/buy', component: buy, meta: {allowBack: true, title: '购买'}
}, {
  path: '/mine/order', component: order, meta: {allowBack: true, title: '我的订单'}
}, {
  path: '/mine/wallet',
  component: wallet,
  children: [
    {path: 'balance', component: balance, meta: {allowBack: true, title: '余额'}},
    {path: 'integral', component: integral, meta: {allowBack: true, title: '积分'}},
    {path: 'recharge', component: recharge, meta: {allowBack: true, title: '充值'}}
  ], meta: {allowBack: true, title: '我的钱包'}
}, {
  path: '/mine/about/index', component: aboutindex, meta: {allowBack: true, title: '关于我们'}
}, {
  path: '/mine/about/advice', component: advice, meta: {allowBack: true, title: '意见反馈'}
}, {
  path: '/mine/about/agree', component: agree, meta: {allowBack: true, title: '服务条款'}
}, {
  path: '/mine/about/about', component: about, meta: {allowBack: true, title: '关于我们'}
}, {
  path: '/wel', component: welcome, meta: {allowBack: true, title: '加载中...'}
},{
  path: '/act', component: act, meta: {allowBack: true, title: '加载中...'}
}, {
  path: '/recharge/msg', component: recharge_msg
}, {
  path: '/video/pay', component: pay, meta: {allowBack: true, title: '支付'}
}]

Vue.prototype.wxinfo = {
  URL: "http%3A%2F%2F19f176814r.imwork.net",
   APPID: 'wxc24d07d05cfea4d3',
  //APPID: 'wxb636c0b09a3fd9d1',
  user: {}
}
Vue.prototype.his = {
  from: '',
  to: '',
  time: 0
}
Vue.prototype.common = {
   SERVER_URL: "http://192.168.2.6:8080/hotel_vod/",
  //SERVER_URL: "https://shengvideo.com/hotel_vod/",
  TOKEN: {},
  lastPage: '',
  wxinit: false
}
Vue.prototype.current = {
  video: {},
}
Vue.prototype.api_post = function (url, success, fail) {
  if (new Date() > this.common.TOKEN.expireTime) {
    window.location.reload()
  }
  if (url.indexOf("?") == -1) {
    url += "?now_time=" + new Date().getTime()
  }
  var local_url = this.common.SERVER_URL + url + "&openid=" + this.wxinfo.user.unionId
    + "&token=" + this.common.TOKEN.token + "&tokenType=1"
  this.$http.post(local_url)
    .then(function (res) {
      if (res.data.code == 0) {
        success(res.data)
      } else {
        if (fail != null) {
          fail(res.data)
        } else {
          this.$vux.toast.text(res.data.msg, 'center')
        }
      }
    }, function (res) {
      this.$vux.toast.text('连接失败，请检查网络', 'center')
    })

}


Vue.prototype.getUrlKey = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

Vue.prototype.QRcode = function () {
  var that = this
  this.$wechat.scanQRCode({
    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
    success: function (res) {
      var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      console.log("result", result)
      try {
        var obj = JSON.parse(result);
        if (obj.mac == null) {
          that.$vux.toast.text('错误二维码', 'center')
          return
        }
        if (new Date().getTime() - obj.time > 2 * 60 * 60 * 1000) {
          that.$vux.toast.text('二维码已失效', 'center')
          return
        }
        that.api_post("api/vod/bind?mac=" + obj.mac, function (res) {
          that.$vux.alert.show({
            title: '认证成功',
            content: '播放设备已认证,您可以继续之前的操作',
            onShow() {
            },
            onHide() {
            }
          })
        })

      } catch (e) {
        that.$vux.toast.text('错误二维码', 'center')
      }

    }
  });
}

Vue.prototype.Play = function (sid) {
  var that = this
  var url = "api/vod/play?sid=" + sid;
  this.api_post(url, function (res) {
    that.$vux.toast.text('播放成功！', 'center')
  }, function (res) {
    if (res.code == 100) {
      that.QRcode()
    }
  })
}


const router = new VueRouter({
  routes: routes
})


router.beforeEach((to, from, next) => {
  // console.log("to", to.path)
  // console.log("from", from.path)

  window.document.title = to.meta.title;


  if (router.app.wxinfo.user.unionId == null && to.path != "/wel") {
    console.log("替换:", to.path)
    router.app.common.lastPage = to.path;
    router.app.common.lastUrl = window.location.href;
    next({path: "/wel"})

  } else {
    if (to.path == "/wel" && router.app.wxinfo.user.unionId != null) {
      next({path: "/"})
      return
    }
    // if(router.app.his.from == to.path &&
    //   router.app.his.to == from.path && new Date().getTime() - router.app.his.time < 200){
    //   console.log("拒绝返回",from.path)
    //
    //
    //   history.pushState(null, null, "/#" + from.path)
    //   return false
    //
    // }
    next()

    let allowBack = true    //    给个默认值true


    if (to.meta.allowBack !== undefined) {
      allowBack = to.meta.allowBack
    }
    if (!allowBack) {
      history.pushState(null, null, location.href)
    }

    router.app.his.from = from.path
    router.app.his.to = to.path
    router.app.his.time = new Date().getTime()
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

