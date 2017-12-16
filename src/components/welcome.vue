<template>
  <div>
    <load-more :show-loading="false" tip="别着急!!! 先看看广告" background-color="#fbf9fe"></load-more>
  </div>
</template>

<script>
    import LoadMore from "vux/src/components/load-more/index";

    export default {
      components: {LoadMore},
      name: "welcome"
      ,
      mounted() {
        var code = this.getUrlKey("code")
        var that = this
        console.log(code)

        if (code != null){
          this.$http.post(this.common.SERVER_URL + "mp/snsapi_userinfo?code=" + code)
            .then(function (res) {
              this.wxinfo.user = res.data.data
              this.common.TOKEN = res.data.token
              this.common.TOKEN.expireTime = new Date(new Date().getTime() + (this.common.TOKEN.expire * 1000) - 60 * 1000)
              var state = { 'page_id': 1, 'user_id': 5 };
              var title = '11院线';
              var url = '/#'+ this.$router.currentRoute.path;
              that.initWechat
              history.pushState(state, title, url);
              this.$router.replace(this.common.lastPage)
            })
        }else {
          console.log(this.wxinfo.user)
          if (this.wxinfo.user.unionId != null){
            return;
          }
          var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ this.wxinfo.APPID
            +"&redirect_uri="+ encodeURIComponent(this.common.lastUrl)
            +"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
          //+ "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
          window.location.href = url

        }

      },
      methods:{
        initWechat:function () {
          var url = window.location.href
          this.$http.post(this.common.SERVER_URL + "mp/jsapi_signature?url=" + encodeURIComponent(url.substring(0,url.indexOf('#'))))
            .then(function (res) {
              var config = res.data.data
              console.log(config)
              this.$wechat.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timestamp, // 必填，生成签名的时间戳
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','openAddress','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
            })
        }
      }
    }
</script>

<style scoped>

</style>
