// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import App from './App'
import Home from './components/Home'
import video from './components/video/video'
import search from './components/video/search'
import record from './components/video/record'
import bought from './components/video/bought'
import discounts from './components/video/discounts'
import room from './components/room/index'
import shop from './components/shop/index'
import mine from './components/mine/index'
import phone from './components/mine/phone'
import detail from './components/video/detail'
import buy from './components/video/buy'
import otherbuy from './components/video/otherbuy'
import pay from './components/video/pay'
import act from './components/video/act'
import wallet from './components/mine/wallet/index'
import balance from './components/mine/wallet/balance'
import integral from './components/mine/wallet/integral'
import aboutindex from './components/mine/about/index'
import advice from './components/mine/about/advice'
import agree from './components/mine/about/agree'
import about from './components/mine/about/about'
import recharge from './components/mine/wallet/recharge'
import order from './components/mine/order'
import welcome from './components/welcome'
import recharge_msg from './components/mine/wallet/msg'
import ctrl from './components/video/ctrl'
import daoqictrl from './components/video/daoqictrl'
import hotel from './components/video/hotel'
import qqmap from './components/video/qqmap'
import gaodemap from './components/video/gaodemap'
import main from './components/video/main'
import music from './components/video/music/index'
import kmusic from './components/video/kmusic/index'
import game from './components/video/game/index'
import nowplay from './components/video/music/nowplay'
import knowplay from './components/video/kmusic/nowplay'
import obuy from './components/video/otherbuy'
// import md5 from 'js-md5'

import {WechatPlugin, LoadingPlugin, ToastPlugin, AlertPlugin} from 'vux'
import {ConfirmPlugin} from 'vux'

var that = this;

Vue.use(ConfirmPlugin);
Vue.use(VueRouter);
Vue.use(Resource);
Vue.use(WechatPlugin);
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
// Vue.use(md5);

//cc00166beabccb5ea6cc80df6f1ebd4b

import VueAMap from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'cc00166beabccb5ea6cc80df6f1ebd4b',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  uiVersion: '1.0.11' // 版本号
});

// let createMap = () => {
//   const promise = new Promise(function (resolve, reject) {
//     let script = document.createElement('script')
//     script.type = 'text/javascript'
//     script.src = 'http://webapi.amap.com/maps?v=1.4.3&key=cc00166beabccb5ea6cc80df6f1ebd4b'   // 高德地图
//     document.body.appendChild(script)
//     if (script.nodeName === 'SCRIPT') {
//       resolve()
//     } else {
//       reject(new Error('Could not script image at ' + script.src))
//     }
//   })
//   return promise
// }
// createMap().then(function () {
//   console.log('读取高德地图成功')
//
// }).catch(function (error) {
//   console.log('发生错误！', error)
// })

const routes = [{
  path: '/',
  component: Home,
  children: [
    {path: '/', component: main, meta: {allowBack: false, title: '娱乐'}},
    {path: '/main', component: main, meta: {allowBack: false, title: '娱乐'}},
    {path: '/room', component: room, meta: {allowBack: false, title: '订房'}},
    {path: '/video/daoqictrl', component: daoqictrl, meta: {allowBack: false, title: '遥控器'}},
    {path: '/shop', component: shop, meta: {allowBack: false, title: '购物'}},
    {path: '/mine', component: mine, meta: {allowBack: false, title: '我的'}}
  ]
}, {path: '/music', component: music, meta: {allowBack: true, title: 'HIFI音乐'}},
  {path: '/music/nowplay', component: nowplay, meta: {allowBack: true, title: '播放列表'}},
  {path: '/kmusic', component: kmusic, meta: {allowBack: true, title: 'K歌'}},
  {path: '/kmusic/nowplay', component: knowplay, meta: {allowBack: true, title: '已点歌曲'}},
  {path: '/game', component: game, meta: {allowBack: true, title: '电子游戏'}},
  {
    path: '/video', component: video, meta: {allowBack: true, title: '点播'}
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
    path: '/video/otherbuy', component: obuy, meta: {allowBack: true, title: '包时购买'}
  }, {
    path: '/video/otherbuy', component: otherbuy, meta: {allowBack: true, title: '购买'}
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
  }, {path: '/mine/phone', component: phone, meta: {allowBack: true, title: '验证'}}, {
    path: '/mine/about/index', component: aboutindex, meta: {allowBack: true, title: '关于我们'}
  }, {
    path: '/mine/about/advice', component: advice, meta: {allowBack: true, title: '意见反馈'}
  }, {
    path: '/mine/about/agree', component: agree, meta: {allowBack: true, title: '功能建设中'}
  }, {
    path: '/mine/about/about', component: about, meta: {allowBack: true, title: '关于我们'}
  }, {
    path: '/wel', component: welcome, meta: {allowBack: true, title: '加载中...'}
  }, {
    path: '/act', component: act, meta: {allowBack: true, title: '优惠'}
  }, {
    path: '/recharge/msg', component: recharge_msg
  }, {
    path: '/video/pay', component: pay, meta: {allowBack: true, title: '支付'}
  }, {
    path: '/video/hotel', component: hotel, meta: {allowBack: true, title: '附近酒店'}
  }, {
    path: '/video/qqmap', component: qqmap, meta: {allowBack: true, title: '地图'}
  }, {
    path: '/video/gaodemap', component: gaodemap, meta: {allowBack: true, title: '高德地图'}
  }, {
    path: '/video/ctrl', component: ctrl, meta: {allowBack: true, title: '遥控器'}
  }


];

Vue.prototype.wxinfo = {
  URL: "http%3A%2F%2F19f176814r.imwork.net",
  // APPID: 'wxc24d07d05cfea4d3',//lv
  // APPID: 'wxb636c0b09a3fd9d1',//zhu
  // APPID: 'wx4c232a8e7d2158ab',//公司
  APPID: 'wx23186818f05e0eeb',//广州1
  // APPID: 'wxbe672b52ba458930',//广州2
  user: {},
};
Vue.prototype.his = {
  from: '',
  to: '',
  time: 0
};
Vue.prototype.common = {
  ID_HIGH_ORDER: 10000000000,
  // SERVER_URL: "http://192.168.2.17:8080/hotel_vod/",//lv
  // SERVER_URL: "http://192.168.2.4:8080/hotel_vod/",//zhu
  //  SERVER_URL: "http://shengvideo.com/hotel_vod/",//公司
  SERVER_URL: "https://11yuanxian.com/hotel_vod/",//广州
  // SERVER_URL: "http://192.168.44.120:8080/hotel_vod/",//调试
  TOKEN: {},
  lastPage: '',
  lastUrl: '',
  wxinit: false,
  dqurl: "",
  playvideo: {},
  playtype: 0,
  savevodcatpos: 0,
  savevodcat: 0,
  savevodlistpos: 0,
  savevodlist: 0,
  savevodlistmusic: 0,
  savevodlistktv: 0,
  savevodlistktvp: 0,
  savevodlistgame: 0,

  currentlist: null,
  currentlistmusic: null,
  currentlistktv: null,
  currentlistktvp: null,
  currentlistgame: null,
  isband: false,
};

Vue.prototype.current = {
  video: {},
  vid: 0,
};
Vue.prototype.api_post = function (url, success, fail) {

  if (new Date() > this.common.TOKEN.expireTime) {
    window.location.reload()
  }
  if (url.indexOf("?") == -1) {
    url += "?now_time=" + new Date().getTime()
  }
  var local_url = this.common.SERVER_URL + url + "&openid=" + this.wxinfo.user.unionId
  // var local_url = this.common.SERVER_URL + url + "&openid=" + this.wxinfo.user.openId
    + "&token=" + this.common.TOKEN.token + "&tokenType=1";
  console.log(local_url)
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

};


Vue.prototype.getUrlKey = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
};

Vue.prototype.toHighId = function (id, type, sType) {

  return (sType * 10 * this.common.ID_HIGH_ORDER) + (parseInt(type) * this.common.ID_HIGH_ORDER) + parseInt(id);
}

Vue.prototype.formHighId = function (hid) {
  if (parseInt(hid) < this.common.ID_HIGH_ORDER) {
    return hid;
  }
  return parseInt(hid) % this.common.ID_HIGH_ORDER;
}

Vue.prototype.getSType = function (hid) {
  if (parseInt(hid) < this.common.ID_HIGH_ORDER) {
    return 1;
  }
  return parseInt(hid / (this.common.ID_HIGH_ORDER * 10));
}

Vue.prototype.getType = function (hid) {
  if (parseInt(hid) < this.common.ID_HIGH_ORDER) {
    return 1;
  }
  return parseInt(hid / this.common.ID_HIGH_ORDER) % 10;
}


Vue.prototype.QRcode = function () {
  var tt = this;
  this.$wechat.scanQRCode({
    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
    success: function (res) {
      var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      window.location.href = result
      // console.log("result", result)
      // try {
      //
      //   tt.ws = tt.QrString(result, "ws")
      //   tt.sn = tt.QrString(result, "sn")
      //   tt.HOTEL_URL_DAOQI = "http://" + tt.QrString(result, "hs")
      //   tt.hotelid = tt.QrString(result, "hotelid")
      //   tt.roomid = tt.QrString(result, "roomid")
      //
      //   if (tt.roomid != null) {
      //     tt.api_post("api/vod/bind?mac=" + tt.roomid, function (res) {
      //
      //       tt.common.hotel = res.data
      //       alert("刷新1")
      //       window.refresh()
      //       alert(tt.common.hotel)
      //     }, function (res) {
      //       tt.$router.replace("/video")
      //     })
      //   }
      // } catch (e) {
      //   tt.$vux.toast.text('错误二维码', 'center')
      // }
    }
  });
};

// openid  会员openid
// sid    资源id
//             type:1,     // 资源类型: 1. 电影 2. 直播 3. KTV 4.音乐 5.游戏
// dimensions   2d/3d       1.2d,2.3d  默认2d
// localhost:8080/hotel_vod/api/vod/play?openid=123&sid=123456
//   返回：data  上次播放位置
// 错误代码: 100 未绑定, 110 未支付
Vue.prototype.Play = function (sid, dim, list, typ) {

  var tt = this;
  var dimensions = '';
  var type = '';
  if (dim != null) {
    dimensions = "&dimensions=" + dim
  }
  if (typ != null) {
    type = "&type=" + typ
  }
  var url = "api/vod/play?sid=" + sid + dimensions + type;
  // console.log(url)
  this.api_post(url,
    function (res) {
      tt.common.playtype = 1;
      localStorage.setItem("playtype", 1);
      localStorage.setItem("playname", list.name);

      // tt.$vux.toast.text('播放成功！', 'center')
      tt.$router.push("/video/ctrl?seekto=" + res.lastPoint)
    }, function (res) {
      if (res.code == 100) {
        tt.$vux.confirm.show({
          confirmText: "扫描二维码",
          title: "未认证设备",
          content: "播放影片时需扫描你所在酒店播放设备显示的二维码",
          onCancel() {
          },
          onConfirm() {
            tt.QRcode()
          }
        })

      } else {
        tt.$vux.toast.text(res.msg + ":" + tt.roomid, 'center')
      }
    })
};


const router = new VueRouter({
  routes: routes
});


Vue.prototype.ws = this.getQueryString("ws");
Vue.prototype.sn = this.getQueryString("sn");
Vue.prototype.HOTEL_URL_DAOQI = "http://" + this.getQueryString("hs");
Vue.prototype.hotelid = this.getQueryString("hotelid");
Vue.prototype.roomid = this.getQueryString("roomid");

export function getQueryString(name) {
  let reg = `(^|&)${name}=([^&]*)(&|$)`;
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    var value = unescape(r[2]);
    localStorage.setItem(name, value);
    return value
  } else {
    return null;
  }
}

Vue.prototype.QrString = function (url, name) {
  let reg = `(^|&)${name}=([^&]*)(&|$)`;
  let r = url.substr(1).match(reg);
  if (r != null) {
    var value = unescape(r[2]);
    localStorage.setItem(name, value);
    return value
  } else {
    return null;
  }
};

Vue.prototype.bindroom = function () {
  var tt = this;


  if (this.roomid == "") {
    tt.$vux.confirm.show({
      confirmText: "扫描二维码",
      title: "未绑定播放设备",
      content: "播放影片时需扫描你所在酒店播放设备显示的二维码",
      onCancel() {
      },
      onConfirm() {
        that.QRcode()
      }
    });

  } else {

  }

};


router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  if (router.app.wxinfo.user.openId == null && to.path != "/wel") {
    console.log("替换:", to.path);
    router.app.common.lastPage = to.fullPath;
    router.app.common.lastUrl = window.location.href;
    next({path: "/wel"})
    // alert("111111111111111")
  } else {
    // alert("2222222222222222")
    if (to.path == "/wel" && router.app.wxinfo.user.openId != null) {
      next({path: "/"});
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
    next();

    let allowBack = true;    //    给个默认值true


    if (to.meta.allowBack !== undefined) {
      allowBack = to.meta.allowBack
    }
    if (!allowBack) {
      history.pushState(null, null, location.href)
    }

    router.app.his.from = from.path;
    router.app.his.to = to.path;
    router.app.his.time = new Date().getTime()

    // this.checkPlatform()
  }

  // store.dispatch('updateAppSetting', {
  //   allowBack: allowBack
  // })
});
FastClick.attach(document.body);

Vue.config.productionTip = false;


Vue.prototype.dqsocketcon = function () {
  // console.log("sssssssssssss")
  var tt = this
  var ws = ""

  if (tt.ws != null) {
    ws = "ws://" + tt.ws
  } else if (localStorage.getItem("ws") != null) {
    ws = "ws://" + localStorage.getItem("ws")
  } else {
    return;
  }
  window.dqsocket = new WebSocket(ws, 'dumb-increment-protocol');
  window.dqsocket.onopen = function (msg) {
    console.log("连接客户端" + ws + "成功")
    // tt.$vux.toast.text("连接客户端" + ws + "成功", 'center')
  }
  // tt.dqsocket.onmessage=function (msg) {
  //   // console.log(msg)
  // }
  window.dqsocket.onclose = function (msg) {
    tt.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
  }
};


/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box');


// function checkPlatform(){
//   if(/android/i.test(navigator.userAgent)){
//     document.write("This is Android'browser.");//这是Android平台下浏览器
//   }
//   if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
//     document.write("This is iOS'browser.");//这是iOS平台下浏览器
//   }
//   if(/Linux/i.test(navigator.userAgent)){
//     document.write("This is Linux'browser.");//这是Linux平台下浏览器
//   }
//   if(/Linux/i.test(navigator.platform)){
//     document.write("This is Linux operating system.");//这是Linux操作系统平台
//   }
//   if(/MicroMessenger/i.test(navigator.userAgent)){
//     document.write("This is MicroMessenger'browser.");//这是微信平台下浏览器
//   }
// }


