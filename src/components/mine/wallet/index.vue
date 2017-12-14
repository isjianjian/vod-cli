<template>
  <div>
      <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
           style="width: 100%">
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==0">
          余额
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==1">
          积分
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==2">
          充值
        </tab-item>
      </tab>
      <router-view class="router-view">

      </router-view>
  </div>
</template>

<script>
    import ViewBox from "vux/src/components/view-box/index";
    export default {
      components: {ViewBox},
      name: "index"
    }
</script>

<style scoped>

</style>
