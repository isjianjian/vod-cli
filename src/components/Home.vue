<template>
  <div style="height:100%;">
      <router-view v-bind:style="{height: root_style + 'px'}" class="router-view"></router-view>
      <app-footer></app-footer>
  </div>
</template>
<style>
</style>
<script>
  import { Tab, TabItem,TransferDom} from 'vux'
  import AppFooter from './Footer'
  export default {
    name: "home",
    data () {
      console.log("窗口高度", document.documentElement.clientHeight)
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
      var code = this.getUrlKey("code")
      console.log(code)
      if (code != null){
        this.$http.post("http://noangry.vicp.io/hotel_vod/mp/snsapi_userinfo?code=" + code)
          .then(function (res) {
            this.wxinfo.user = res.data.data
          })
      }else {
        return
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ this.wxinfo.APPID
          +"&redirect_uri="+ this.wxinfo.URL
           +"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
          //+ "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
        console.log("url:",this.wxinfo.URL)
        window.location.href = url
      }
    }
  }
</script>

<style scoped>

</style>
