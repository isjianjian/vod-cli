<template>
  <div style="height:100%;">
    <router-view v-bind:style="{height: root_style + 'px'}" class="router-view"></router-view>
    <app-footer></app-footer>
  </div>
</template>
<style>
</style>
<script>
  import {Tab, TabItem, TransferDom} from 'vux'
  import AppFooter from './Footer'

  export default {
    name: "home",
    data() {
      // console.log("窗口高度", document.documentElement.clientHeight)
      return {
        root_style: document.documentElement.clientHeight - 53
      }
    },
    components: {
      Tab,
      TabItem,
      AppFooter,
    },
    mounted() {
      if (!this.common.wxinit) {
        this.initWechat()
      }
      this.checkonline()
      this.dqsocketcon()
    },
    methods: {
      checkonline: function () {
        var that = this;
        that.api_post("api/bind/vi", function (res) {
          setTimeout(function (res) {
            that.checkonline()
          }, 5 * 60 * 1000)
        }, function (res) {
          if (that.common.hotel != null) {
            window.location.href = "/"
          }

        })

      },
      initWechat: function () {
        var url = window.location.href;
        var s_url = encodeURIComponent(url);
        // this.$vux.toast.show({
        //   text:"授权地址:" + s_url,
        //   position:'center',
        //   time:2000
        // })

        this.$http.post(this.common.SERVER_URL + "mp/jsapi_signature?url=" + url)
          .then(function (res) {
            var config = res.data.data;
            // console.log(config)
            this.$wechat.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: config.appId, // 必填，公众号的唯一标识
              timestamp: config.timestamp, // 必填，生成签名的时间戳
              nonceStr: config.nonceStr, // 必填，生成签名的随机串
              signature: config.signature,// 必填，签名，见附录1
              jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openAddress', 'chooseWXPay', 'scanQRCode', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            this.common.wxinit = true
          })
      }
    }
  }
</script>

<style scoped>

</style>
