<template>
  <div>
    <!--<load-more :show-loading="false" tip="别着急!!! 先看看广告" background-color="#fbf9fe"></load-more>-->
  </div>
</template>

<script>
  import LoadMore from "vux/src/components/load-more/index";

  export default {
    components: {LoadMore},
    name: "welcome"
    ,
    mounted() {
      setTimeout(function () {
        localStorage.clear()
      }, 3 * 60 * 60 * 1000);

      var code = this.getUrlKey("code");
      var that = this;
      // console.log("code",code)
      if (code != null) {
        var url = '/?#' + this.$router.currentRoute.path;
        var state = {'page_id': 1, 'user_id': 5};
        var title = '11院线';
        history.pushState(state, title, url);

        this.$http.post(this.common.SERVER_URL + "mp/snsapi_userinfo?code=" + code)
          .then(function (res) {
            this.wxinfo.user = res.data.data;
            this.common.TOKEN = res.data.token;
            this.common.TOKEN.expireTime = new Date(new Date().getTime() + (this.common.TOKEN.expire * 1000) - 60 * 1000);
             var roomid = that.roomid;
            //var roomid = localStorage.getItem("roomid");
            if (roomid == null) {

              this.api_post("api/bind/vi", function (res) {
                that.common.hotel = res.data;
                // that.$vux.toast.text('连接成功！', 'center')
                // console.log("---------------------------1", that.common)
                that.$router.replace(that.common.lastPage)
              }, function (res) {
                that.$vux.toast.text(res.msg, 'center');
                that.$router.replace(that.common.lastPage)
              })

              // var r = localStorage.getItem("roomid");
              // var time = localStorage.getItem("time");
              // if (r != null) {
              //   if (time != null && new Date().getTime() - 3 * 60 * 60 * 1000 < time) {
              //     roomid = r;
              //     that.ws = localStorage.getItem("ws");
              //     that.sn = localStorage.getItem("sn");
              //     that.HOTEL_URL_DAOQI = "http://" + localStorage.getItem("hs");
              //     that.hotelid = localStorage.getItem("hotelid");
              //
              //   }
              // }
            } else {
              localStorage.setItem("time", new Date().getTime())
            }

            if (roomid != null) {
              this.api_post("api/vod/bind?mac=" + roomid, function (res) {
                that.common.hotel = res.data;
                // that.$vux.toast.text('连接成功！', 'center')
                // console.log("---------------------------1", that.common)
                that.$router.replace(that.common.lastPage)
              }, function (res) {
                that.$vux.toast.text(res.msg, 'center');
                that.$router.replace(that.common.lastPage)
              })

            } else {
              that.$vux.toast.text("未绑定客户端", 'center');
              that.$router.replace(that.common.lastPage)
            }
          })
      } else {
        console.log("wxinfo", this.wxinfo.user);
        if (this.wxinfo.user.unionId != null) {
          return;
        }
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.wxinfo.APPID
          + "&redirect_uri=" + encodeURIComponent(this.common.lastUrl)
          + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

        //+ "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
        window.location.href = url
      }

    },
    methods: {}
  }
</script>

<style scoped>

</style>
