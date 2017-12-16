<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  mounted(){
    window.onpopstate = () => {
      if (!this.allowBack) {    //    这个allowBack 是存在vuex里面的变量
        history.go(1)
      }
    }
    if (this.$router.currentRoute.path != '/wel'){
      console.log("替换:",this.$router.currentRoute.path)
      this.common.lastPage = this.$router.currentRoute.path;
      this.common.lastUrl = window.location.href;
    }
    this.$router.replace('/wel')
  },
  methods:{

  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
