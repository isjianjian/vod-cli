<template>
  <div>


    <group title="酒店列表">
      <cell :title="item.name" v-for="item in hotel_list"
            :link="'/video/qqmap?clat='+lat+'&clon='+lon+'&hlat='+item.lat+'&hlon='+item.lon"
            is-link>
        到这去
      </cell>
    </group>

    <div v-if="hotel_list.length == 0" class='loading'>
        <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
         暂无数据
         </span>
    </div>
  </div>
</template>

<script>

  var that;
  import Group from "vux/src/components/group/index";
  import Cell from "vux/src/components/cell/index";



  export default {
    components: {

      Cell,
      Group
    },
    name: "hotel",
    data() {
      return {
        lon: '',
        lat: '',
      }
    },
    data() {
      return {
        hotel_list: [],
      }
    }
    ,
    mounted() {
      that = this;

      var url = window.location.href;
      that.$http.post(that.common.SERVER_URL + "mp/jsapi_signature?url=" + url)
        .then(function (res) {
          var config = res.data.data;

          that.$wechat.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: config.appId, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openAddress', 'chooseWXPay', 'scanQRCode', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          that.common.wxinit = true
        });
      that.$wechat.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          that.lat = res.latitude;
          that.lon = res.longitude;
          alert("lat:"+that.lat+" lon:"+that.lon);
          that.hotellist();
        }
      });


    }
    ,

    methods: {
      hotellist: function () {
        // console.log("******************************************", "lat = "+ that.lat +" & lon = "+that.lon)
        var url = "api/hotel/nearby?lat=" + that.lat + "&lon=" + that.lon;
        that.api_post(url, function (res) {
          // console.log(res)
          that.hotel_list = res.data
        }, function (res) {
          // console.log(res)
          that.$vux.toast.show(res.msg)
        })
      }
    }
  }
</script>


<style scoped>
  @import 'video.css';
</style>
