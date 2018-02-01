<!--<template>-->
  <!--<div class="amap-page-container">-->
    <!--<el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin"-->
             <!--:events="events" class="amap-demo">-->
    <!--</el-amap>-->

    <!--<div class="toolbar">-->
      <!--<button @click="getMap()">get map</button>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import VueAMap from "vue-amap"-->
  <!--import ElAmap from "vue-amap/src/lib/components/amap";-->

  <!--let amapManager = new VueAMap.AMapManager();-->
  <!--var that-->
  <!--export default {-->
    <!--// components: {ElAmap},-->
    <!--name: "null",-->
    <!--data: function () {-->
      <!--return {-->
        <!--amapManager,-->
        <!--zoom: 12,-->
        <!--center: [121.59996, 31.197646],-->
        <!--events: {-->
          <!--init: (o) => {-->
            <!--console.log("ssssssssssssss")-->
            <!--console.log(o.getCenter())-->
            <!--console.log(this.$refs.map.$$getInstance())-->
            <!--o.getCity(result => {-->
              <!--console.log(result)-->
            <!--})-->
          <!--},-->
          <!--'moveend': () => {-->
          <!--},-->
          <!--'zoomchange': () => {-->
          <!--},-->
          <!--'click': (e) => {-->
            <!--alert('map clicked');-->
          <!--}-->
        <!--},-->
        <!--plugin: ['ToolBar', {-->
          <!--pName: 'MapType',-->
          <!--defaultType: 0,-->
          <!--events: {-->
            <!--init(o) {-->
              <!--console.log(o);-->
            <!--}-->
          <!--}-->
        <!--}]-->
      <!--};-->
    <!--},-->
    <!--mounted() {-->
      <!--// console.log(amapManager)-->
      <!--that = this-->
    <!--},-->
    <!--methods: {-->
      <!--getMap() {-->
        <!--// amap vue component-->
        <!--console.log(amapManager._componentMap);-->
        <!--// gaode map instance-->
        <!--console.log(amapManager._map);-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--.amap-demo {-->
    <!--height: 300px;-->
  <!--}-->
<!--</style>-->
