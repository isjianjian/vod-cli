<template>
  <div>
    <div :style="wh" id="container">
    </div>
    <div style="width:603px;padding-top:10px;" id="plans">
    </div>
  </div>
</template>

<script>
  import {TMap} from '../../TMap'

  var that;
  export default {

    name: "map",
    data() {
      return {
        wh: '',

        clon: '',
        clat: '',
        hlon: '',
        hlat: '',

        qq: {},
        transferService: {},
      }
    },
    mounted() {
      // console.log("..............................................",qq)

      that = this;
      var par = that.$router.currentRoute.query;
      that.wh = "width:" + window.innerWidth + "px;height:" + window.innerHeight + "px;";

      that.clon = par.clon;
      that.clat = par.clat;
      that.hlon = par.hlon;
      that.hlat = par.hlat;

      TMap('SBLBZ-SQ26Q-HLB57-GKRRL-CTWSQ-T7FOD').then(qq => {
        var map = new qq.maps.Map(document.getElementById("container"), {
          // 地图的中心地理坐标。
          center: new qq.maps.LatLng(that.hlat, that.hlon),
          zoom: 20
        });
      });

    }
  }
</script>

<style scoped>

</style>
