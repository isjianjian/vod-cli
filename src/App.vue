<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import JQ from 'jquery'

  export default {
    components: {JQ},
    name: 'app',

    mounted() {

      window.onpopstate = () => {
        var allowBack = this.$router.currentRoute.meta.allowBack;
        // console.log(this.$router.currentRoute.meta.allowBack)
        if (allowBack != null && !allowBack) {    //    这个allowBack 是存在vuex里面的变量
          history.go(1)
          // window.close();  alert("111111111")
        } else {
          // alert("22222222222222")
        }
      }
    },
    methods: {

    }
  }

</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  body {
    background-color: #fbf9fe;
  }
</style>
