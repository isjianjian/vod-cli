<template>
  <div>
    <iframe style="width: 99%;height:99%;" :src="url"></iframe>
  </div>
</template>

<script>
  import md5 from 'js-md5';

  let Base64 = require('js-base64').Base64;

  export default {
    name: "index",
    data() {
      return {
        url:
          "http://1.dev-reservation.ffun360.com/site_admin/index?"
        // +"&t=1519809759" +
        // "&openid=oDsqh1C2ebM_dMiiLCATdHeLwalk" +
        // "&nickname=Liu&sex=1&province=%E5%B9%BF%E4%B8%9C" +
        // "&city=%E5%B9%BF%E5%B7%9E" +
        // "&country=china" +
        // "&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FNoCVVq1btRUBkz0jsx7l2xXDnnwdgicZIa3YeoNtCDeMDe0lhEeia34mnwEuj3NjickNBr4WGEkvochG6RovUfLWw%2F132&token=03D85B26BB7263B46998BC69A86DCFCC",
      }

    },
    mounted() {
      // console.log(md5)
      var that =this
      // console.log(this.wxinfo.user)
      var time=Math.round(new Date().getTime()/1000);

      var user = this.wxinfo.user

      var eidtionTypeList = [
        {key:"come_from",val:"1"},
        {key: "t", val:time},
        {key: "openid", val: user.openId},
        {key: "nickname", val: user.nickname},
        {key: "sex", val: user.sexId},
        {key: "province", val: user.province},
        {key: "city", val: user.city},
        {key: "country", val: user.country},
        {key: "headimgurl", val: user.headImgUrl},
        {key: "yxtoken", val:  that.common.TOKEN},
      ];
      eidtionTypeList.sort(function (a, b) {
        return a.key > b.key;
      });


      console.log(eidtionTypeList[0].key + "" + eidtionTypeList[0].val);

      var s=""
      for (var i = 0; i < eidtionTypeList.length; i++) {
        s += eidtionTypeList[i].key + "" + eidtionTypeList[i].val
      }
      s = "8cff406dd2e5897bf0581723e95fe246"+s + "8cff406dd2e5897bf0581723e95fe246";
      // 8cff406dd2e5897bf0581723e95fe2467892E144620F8264634487B77C2BE562
      console.log(s);


      var token=md5(s)
      token=  token.toString().toUpperCase()
      // console.log(token.toString().toUpperCase());


      this.url =this.url + "come_from=1"+"&t=" + time + "&openid=" + user.openId + "&nickname=" + encodeURIComponent(user.nickname)
        + "&sex=" + user.sexId + "&province=" + encodeURIComponent(user.province) + "&city=" + encodeURIComponent(user.city) + "&country=" + encodeURIComponent(user.country)+
        "&headimgurl=" + encodeURIComponent(user.headImgUrl) + "&token=" + token+"&yxtoken="+this.common.TOKEN;


      // alert(this.url)
      console.log(this.url)

    }, methods: {}
  }
</script>

<style scoped>

</style>
