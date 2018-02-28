<template>
  <div>
      <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
           style="width: 100%">
        <tab-item  @on-item-click="cat"  v-bind:selected="tab_index==0">
          余额
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==1">
          积分
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==2">
          充值
        </tab-item>
      </tab>
      <router-view @ref-tab="ref_tab" class="router-view">
      </router-view>
  </div>
</template>

<script>
    import ViewBox from "vux/src/components/view-box/index";
    import TabItem from "vux/src/components/tab/tab-item";
    import Tab from "vux/src/components/tab/tab";
    export default {
      components: {
        Tab,
        TabItem,
        ViewBox},
      name: "index",
      mounted(){
        this.ref_tab()
      },
      data(){
        return{
          tab_index:0
        }
      },
      methods:{
        cat:function (res) {
          this.tab_index = res;
          if(res == 0){
            this.$router.replace("/mine/wallet/balance")
          }
          if(res == 1){
            this.$router.replace("/mine/wallet/integral")
          }
          if(res == 2){
            this.$router.replace("/mine/wallet/recharge")
          }
        },
        ref_tab:function () {
          if(this.$router.currentRoute.path == "/mine/wallet/balance"){
            this.tab_index = 0
          }
          if(this.$router.currentRoute.path == "/mine/wallet/integral"){
            this.tab_index = 1
          }
          if(this.$router.currentRoute.path == "/mine/wallet/recharge"){
            this.tab_index = 2
          }
          console.log("ref_tab2",this.tab_index)
        }
      }
    }
</script>

<style scoped>

</style>
