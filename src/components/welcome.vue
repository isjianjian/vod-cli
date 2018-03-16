<template>
  <div>
    <!--<load-more :show-loading="false" tip="正在启动" background-color="#fbf9fe"></load-more>-->
  </div>
</template>

<script>
  import LoadMore from "vux/src/components/load-more/index";

  export default {
    components: {LoadMore},
    name: "welcome"
    ,
    mounted() {


      var code = this.getUrlKey("code");
      var that = this;

      if (code != null) {
        var url = '/?#' + this.$router.currentRoute.path;
        var state = {'page_id': 1, 'user_id': 5};
        var title = '11院线';
        history.pushState(state, title, url);

        this.$http.post(this.common.SERVER_URL + "mp/snsapi_userinfo?code=" + code)
          .then(function (res) {
            this.wxinfo.user = res.data.data;
            this.common.TOKEN = res.data.token;
            this.wxinfo.user.level = res.data.level;
            this.common.TOKEN.expireTime = new Date(new Date().getTime() + (this.common.TOKEN.expire * 1000) - 60 * 1000);
            var roomid = that.roomid;
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
              this.api_post("api/bind/vi", function (res) {
                that.common.hotel = res.data;
                that.$router.replace(that.common.lastPage)
              }, function (res) {
                // that.$vux.toast.text(res.msg, 'center');
                that.$router.replace(that.common.lastPage)
              })
            }
          },function () {


            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + that.wxinfo.APPID
              + "&redirect_uri=" + encodeURIComponent(that.common.lastUrl)
              + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            window.location.href = url
          })
      } else {
        console.log("wxinfo", this.wxinfo.user);
        if (this.wxinfo.user.unionId != null) {
          return;
        }
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + that.wxinfo.APPID
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
