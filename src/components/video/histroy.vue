<template>
  <view-box>


    <flexbox class="top">
      <div class="seacher_btn" v-on:click="search"/>
      <x-input readonly="readonly" @click.native="search" class="seacher_input" placeholder="输入片名、主演或导演"></x-input>
      <div class="histroy_btn"/>
    </flexbox>

    <cell title="历史记录" is-link v-on:click.native="">
      <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/histroy_icon.png">
    </cell>
    <cell title="已购买影片" is-link v-on:click.native="">
      <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/ispay_icon.png">
    </cell>
    <cell title="优惠影片" is-link v-on:click.native="">
      <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/discount_icon.png">
    </cell>

  </view-box>
</template>

<script>
  import {Scroller, XInput, ViewBox, Flexbox} from 'vux'
  import Cell from "vux/src/components/cell/index";
  import Group from "vux/src/components/group/index";

  export default {
    name: "search",
    components: {
      Group,
      Cell,
      Scroller,
      XInput, 
      ViewBox,
      Flexbox
    }, data() {
      return {}
    }, methods: {
      search() {
        this.$router.replace("search", function () {

        })
      }
    }
  }
</script>

<style scoped>
  @import 'video.css';
</style>
