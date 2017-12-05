<template>
  <tabbar>
    <tabbar-item selected>
      <img slot="icon" src="../assets/images/video_n.png">
      <img slot="icon-active" src="../assets/images/video_p.png">
      <span slot="label">点播</span>
    </tabbar-item>
    <tabbar-item>
      <img slot="icon" src="../assets/images/room_n.png">
      <img slot="icon-active" src="../assets/images/room_p.png">
      <span slot="label">订房</span>
    </tabbar-item>
    <tabbar-item>
      <img slot="icon" src="../assets/images/shop_n.png">
      <img slot="icon-active" src="../assets/images/shop_p.png">
      <span slot="label">购物</span>
    </tabbar-item>
    <tabbar-item>
      <img slot="icon" src="../assets/images/mine_n.png">
      <img slot="icon-active" src="../assets/images/mine_p.png">
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>
</template>
<style>
  .add{
    height:40px;
    width:40px;
  }
</style>
<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default{
    name: 'AppFooter',
    components: {
      Tabbar,
      TabbarItem,
    },
    data(){
      return{
        msg:''
      }
    },

  }
</script>
