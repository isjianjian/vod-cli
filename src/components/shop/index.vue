<template>
  <div>
    <!--<iframe style="width: 99%;height:99%;" :src="url"></iframe>-->


  </div>
</template>

<script>
  import md5 from 'js-md5';

  let Base64 = require('js-base64').Base64;

  export default {
    name: "index",
    data() {
      return {
        // url:  "http://1.dev-reservation.ffun360.com/site_admin/index?",

        // url: "http://1.dev-reservationstore.ffun360.com/entry/index?",
        url:"http://1.reservationstore.11yuanxian.com/entry/index?",
      }

    },
    mounted() {
      var that = this
      var time = Math.round(new Date().getTime() / 1000);
      var user = this.wxinfo.user
      var eidtionTypeList = [
        {key: "city", val: user.city},
        {key: "come_from", val: "1"},
        {key: "country", val: user.country},
        {key: "headimgurl", val: user.headImgUrl},
        {key: "nickname", val: user.nickname},
        {key: "openid", val: user.openId},
        {key: "province", val: user.province},
        {key: "sex", val: user.sexId},
        {key: "t", val: time},
        {key: "unionid", val: user.unionId},
        {key: "yxtoken", val: that.common.TOKEN.token},

      ];
      // eidtionTypeList.sort(function (a, b) {
      //   console.log(a.key + "----" + b.key + "-----" + (a.key + "" > b.key + ""));
      //   console.log(eidtionTypeList)
      //   return a.key + "" > b.key + "";
      // });


      var s = ""
      for (var i = 0; i < eidtionTypeList.length; i++) {
        s += eidtionTypeList[i].key + "" + eidtionTypeList[i].val
        // console.log(eidtionTypeList[i].key + "----" + eidtionTypeList[i].val);
      }
      s = "8cff406dd2e5897bf0581723e95fe246" + s + "8cff406dd2e5897bf0581723e95fe246";
      // 8cff406dd2e5897bf0581723e95fe2467892E144620F8264634487B77C2BE562
      // console.log(s);


      var token = md5(s)
      token = token.toString().toUpperCase()
      // console.log(token.toString().toUpperCase());

      // this.url = this.url + "come_from=1" + "&t=" + time + "&openid=" + user.openId + "&nickname=" + encodeURIComponent(user.nickname)
      this.url = this.url + "come_from=1" + "&t=" + time + "&openid=" + user.openId + "&unionid=" + user.unionId + "&nickname=" + encodeURIComponent(user.nickname)
        + "&sex=" + user.sexId + "&province=" + encodeURIComponent(user.province) + "&city=" + encodeURIComponent(user.city) + "&country=" + encodeURIComponent(user.country) +
        "&headimgurl=" + encodeURIComponent(user.headImgUrl) + "&token=" + token + "&yxtoken=" + this.common.TOKEN.token;
      console.log(this.url)

      location.href = this.url

    }, methods: {}
  }
</script>

<style scoped>

</style>
