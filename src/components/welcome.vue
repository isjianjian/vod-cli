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
        console.log(code)
        if (code != null){
          this.$http.post(this.common.SERVER_URL + "mp/snsapi_userinfo?code=" + code)
            .then(function (res) {

              this.wxinfo.user = res.data.data
              this.common.TOKEN = res.data.token
              this.$vux.toast.text(res.data.token.token,'center')
              var state = { 'page_id': 1, 'user_id': 5 };
              var title = '11院线';
              var url = '/#'+ this.$router.currentRoute.path;
              history.pushState(state, title, url);
              console.log("res:", res)
              console.log("lastPage:",this.common.lastPage)
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

      }
    }
</script>

<style scoped>

</style>
